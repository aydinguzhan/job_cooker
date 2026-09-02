import { Database } from "../config/database";
import { CreateConversationPayload, SendMessagePayload } from "./messages.entity";



export class MessageRepository {
  constructor(private readonly db: Database) {}

  async createConversation(payload: CreateConversationPayload) {
    const client = await this.db.connect();

    try {
      await client.query("BEGIN");

      const conversationResult = await client.query(
        `
        INSERT INTO conversations (subject)
        VALUES ($1)
        RETURNING *
        `,
        [payload.subject ?? null]
      );

      const conversation = conversationResult.rows[0];

      for (const userId of payload.members) {
        await client.query(
          `
          INSERT INTO conversation_members (
            conversation_id,
            user_id
          )
          VALUES ($1, $2)
          ON CONFLICT DO NOTHING
          `,
          [conversation.id, userId]
        );
      }

      await client.query("COMMIT");

      return conversation;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async addConversationMembers(conversationId: string, userIds: string[]) {
    for (const userId of userIds) {
      await this.db.query(
        `
        INSERT INTO conversation_members (
          conversation_id,
          user_id
        )
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING
        `,
        [conversationId, userId]
      );
    }
  }

  async getConversationById(conversationId: string) {
    const result = await this.db.query(
      `
      SELECT *
      FROM conversations
      WHERE id = $1
      `,
      [conversationId]
    );

    return result.rows[0] ?? null;
  }

  async isConversationMember(conversationId: string, userId: string) {
    const result = await this.db.query(
      `
      SELECT EXISTS (
        SELECT 1
        FROM conversation_members
        WHERE conversation_id = $1
          AND user_id = $2
      ) AS is_member
      `,
      [conversationId, userId]
    );

    return result.rows[0].is_member;
  }

  async getUserConversations(userId: string) {
    const result = await this.db.query(
      `
      SELECT 
        c.id,
        c.subject,
        participant.id AS participant_id,
        participant.first_name AS participant_first_name,
        participant.last_name AS participant_last_name,
        participant.email AS participant_email,
        participant.title AS participant_title,
        participant.profile_image_path AS participant_profile_image_path,
        last_message.body AS last_message,
        last_message.created_at AS last_message_at,
        COUNT(unread_messages.id)::int AS unread_count
      FROM conversations c
      JOIN conversation_members cm
        ON cm.conversation_id = c.id

      LEFT JOIN LATERAL (
        SELECT
          u.id,
          u.first_name,
          u.last_name,
          u.email,
          up.title,
          up.profile_image_path
        FROM conversation_members other_cm
        JOIN users u
          ON u.id = other_cm.user_id
        LEFT JOIN user_profiles up
          ON up.user_id = u.id
        WHERE other_cm.conversation_id = c.id
          AND other_cm.user_id <> $1
        LIMIT 1
      ) participant ON true

      LEFT JOIN LATERAL (
        SELECT m.body, m.created_at
        FROM messages m
        WHERE m.conversation_id = c.id
        ORDER BY m.created_at DESC
        LIMIT 1
      ) last_message ON true

      LEFT JOIN messages unread_messages
        ON unread_messages.conversation_id = c.id
       AND unread_messages.sender_id <> $1

      LEFT JOIN message_reads mr
        ON mr.message_id = unread_messages.id
       AND mr.user_id = $1

      WHERE cm.user_id = $1
        AND mr.message_id IS NULL

      GROUP BY 
        c.id,
        c.subject,
        participant.id,
        participant.first_name,
        participant.last_name,
        participant.email,
        participant.title,
        participant.profile_image_path,
        last_message.body,
        last_message.created_at

      ORDER BY last_message.created_at DESC NULLS LAST
      `,
      [userId]
    );

    return result.rows;
  }

  async getConversationMessages(params: {
    conversationId: string;
    startFrom: number;
    count: number;
  }) {
    const itemsResult = await this.db.query(
      `
      SELECT *
      FROM messages
      WHERE conversation_id = $1
      ORDER BY created_at ASC
      OFFSET $2
      LIMIT $3
      `,
      [params.conversationId, params.startFrom, params.count]
    );

    const countResult = await this.db.query(
      `
      SELECT COUNT(*)::int AS total_count
      FROM messages
      WHERE conversation_id = $1
      `,
      [params.conversationId]
    );

    return {
      items: itemsResult.rows,
      totalCount: countResult.rows[0].total_count,
    };
  }

  async createMessage(payload: SendMessagePayload) {
    const result = await this.db.query(
      `
      INSERT INTO messages (
        conversation_id,
        sender_id,
        body
      )
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [payload.conversation_id, payload.sender_id, payload.body]
    );

    return result.rows[0];
  }

  async markMessageAsRead(params: {
    messageId: string;
    userId: string;
  }) {
    await this.db.query(
      `
      INSERT INTO message_reads (
        message_id,
        user_id
      )
      VALUES ($1, $2)
      ON CONFLICT DO NOTHING
      `,
      [params.messageId, params.userId]
    );
  }

  async markConversationAsRead(params: {
    conversationId: string;
    userId: string;
  }) {
    await this.db.query(
      `
      INSERT INTO message_reads (
        message_id,
        user_id
      )
      SELECT 
        m.id,
        $2
      FROM messages m
      WHERE m.conversation_id = $1
        AND m.sender_id <> $2
      ON CONFLICT DO NOTHING
      `,
      [params.conversationId, params.userId]
    );
  }

  async getUnreadCount(userId: string) {
    const result = await this.db.query(
      `
      SELECT COUNT(m.id)::int AS unread_count
      FROM messages m
      JOIN conversation_members cm
        ON cm.conversation_id = m.conversation_id
      LEFT JOIN message_reads mr
        ON mr.message_id = m.id
       AND mr.user_id = $1
      WHERE cm.user_id = $1
        AND m.sender_id <> $1
        AND mr.message_id IS NULL
      `,
      [userId]
    );

    return result.rows[0].unread_count;
  }
}
