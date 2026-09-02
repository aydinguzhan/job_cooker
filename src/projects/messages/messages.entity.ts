export interface IMessageRepository {
  createConversation(payload: CreateConversationPayload): Promise<Conversation>;

  addConversationMembers(
    conversationId: string,
    userIds: string[]
  ): Promise<void>;

  getUserConversations(userId: string): Promise<ConversationListItem[]>;

  getConversationById(conversationId: string): Promise<Conversation | null>;

  isConversationMember(
    conversationId: string,
    userId: string
  ): Promise<boolean>;

  getConversationMessages(params: {
    conversationId: string;
    userId: string;
    startFrom: number;
    count: number;
  }): Promise<{
    items: Message[];
    totalCount: number;
  }>;

  createMessage(payload: SendMessagePayload & {
    sender_id: string;
  }): Promise<Message>;

  markMessageAsRead(params: {
    messageId: string;
    userId: string;
  }): Promise<void>;

  markConversationAsRead(params: {
    conversationId: string;
    userId: string;
  }): Promise<void>;

  getUnreadCount(userId: string): Promise<number>;
}

export type CreateConversationPayload = {
  subject?: string | null;
  members: string[];
};


export type Conversation = {
  id: string;
  subject: string | null;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
};

export type ConversationMember = {
  conversation_id: string;
  user_id: string;
  created_at: Date;
};

export type SendMessagePayload = {
  conversation_id: string;
  sender_id: string;
  body: string;
};

export type Message = {
  id: string;
  conversation_id: string;
  sender_id: string;
  body: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
};

export type MessageRead = {
  message_id: string;
  user_id: string;
  read_at: Date;
};

export type ConversationListItem = {
  id: string;
  subject: string | null;
  participant_id: string | null;
  participant_first_name: string | null;
  participant_last_name: string | null;
  participant_email: string | null;
  participant_title: string | null;
  participant_profile_image_path: string | null;
  last_message: string | null;
  last_message_at: Date | null;
  unread_count: number;
};

