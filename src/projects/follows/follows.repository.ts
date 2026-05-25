import { Database } from "../config/database";
import {
  FollowRelation,
  FollowUser,
  IFollowEntity,
} from "./follows.entitiy";

export default class FollowsRepository implements IFollowEntity {
  constructor(private readonly db: Database) {}

  async follow(
    followerId: string,
    followingId: string
  ): Promise<FollowRelation> {
    const query = `
      INSERT INTO user_follows (
        follower_id,
        following_id,
        status,
        created_at,
        updated_at,
        deleted_at
      )
      VALUES ($1, $2, true, NOW(), NOW(), NULL)
      ON CONFLICT (follower_id, following_id)
      DO UPDATE SET
        status = true,
        deleted_at = NULL,
        updated_at = NOW()
      RETURNING
        id,
        follower_id,
        following_id,
        status,
        created_at,
        updated_at,
        deleted_at;
    `;

    const { rows } = await this.db.query(query, [followerId, followingId]);
    return rows[0];
  }

  async unfollow(
    followerId: string,
    followingId: string
  ): Promise<FollowRelation | null> {
    const query = `
      UPDATE user_follows
      SET
        status = false,
        deleted_at = NOW(),
        updated_at = NOW()
      WHERE follower_id = $1
        AND following_id = $2
        AND status = true
        AND deleted_at IS NULL
      RETURNING
        id,
        follower_id,
        following_id,
        status,
        created_at,
        updated_at,
        deleted_at;
    `;

    const { rows } = await this.db.query(query, [followerId, followingId]);
    return rows[0] ?? null;
  }

  async getFollowers(userId: string): Promise<FollowUser[]> {
    const query = `
      SELECT
        u.id,
        u.first_name,
        u.last_name,
        u.email,
        up.title,
        up.profile_image_path,
        true AS is_following
      FROM user_follows uf
      JOIN users u
        ON u.id = uf.follower_id
      LEFT JOIN user_profiles up
        ON up.user_id = u.id
        AND up.deleted_at IS NULL
      WHERE uf.following_id = $1
        AND uf.status = true
        AND uf.deleted_at IS NULL
        AND u.is_active = true
      ORDER BY uf.created_at DESC;
    `;

    const { rows } = await this.db.query(query, [userId]);
    return rows;
  }

  async getFollowings(userId: string): Promise<FollowUser[]> {
    const query = `
      SELECT
        u.id,
        u.first_name,
        u.last_name,
        u.email,
        up.title,
        up.profile_image_path,
        true AS is_following
      FROM user_follows uf
      JOIN users u
        ON u.id = uf.following_id
      LEFT JOIN user_profiles up
        ON up.user_id = u.id
        AND up.deleted_at IS NULL
      WHERE uf.follower_id = $1
        AND uf.status = true
        AND uf.deleted_at IS NULL
        AND u.is_active = true
      ORDER BY uf.created_at DESC;
    `;

    const { rows } = await this.db.query(query, [userId]);
    return rows;
  }

  async getSuggestions(userId: string): Promise<FollowUser[]> {
    const query = `
      SELECT
        u.id,
        u.first_name,
        u.last_name,
        u.email,
        up.title,
        up.profile_image_path,
        false AS is_following
      FROM users u
      LEFT JOIN user_profiles up
        ON up.user_id = u.id
        AND up.deleted_at IS NULL
      WHERE u.id <> $1
        AND u.is_active = true
        AND NOT EXISTS (
          SELECT 1
          FROM user_follows uf
          WHERE uf.follower_id = $1
            AND uf.following_id = u.id
            AND uf.status = true
            AND uf.deleted_at IS NULL
        )
      ORDER BY u.created_at DESC
      LIMIT 30;
    `;

    const { rows } = await this.db.query(query, [userId]);
    return rows;
  }
}