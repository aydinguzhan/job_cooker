import { MessageRepository } from './message.repository';
import { CreateConversationPayload, SendMessagePayload } from './messages.entity';

export default class MessageService {
  constructor(private readonly messageRepository: MessageRepository) {}

  async createConversation(payload: CreateConversationPayload) {
    return await this.messageRepository.createConversation(payload);
  }
  async addConversationMembers(conversationId: string, userIds: string[]) {
    return await this.messageRepository.addConversationMembers(conversationId, userIds);
  }
  async getConversationById(conversationId: string) {
    return await this.messageRepository.getConversationById(conversationId);
  }
  async isConversationMember(conversationId: string, userId: string) {
    return await this.messageRepository.isConversationMember(conversationId, userId);
  }
  async getUserConversations(userId: string) {
    return await this.messageRepository.getUserConversations(userId);
  }
  async getConversationMessages(params: {
    conversationId: string;
    startFrom: number;
    count: number;
  }) {
    return await this.messageRepository.getConversationMessages(params);
  }
  async createMessage(payload: SendMessagePayload) {
    return await this.messageRepository.createMessage(payload);
  }

  async markMessageAsRead(params: { messageId: string; userId: string }) {
    return await this.messageRepository.markMessageAsRead(params);
  }
  async markConversationAsRead(params: { conversationId: string; userId: string }) {
    return await this.messageRepository.markConversationAsRead(params);
  }
  async getUnreadCount(userId: string) {
    return await this.messageRepository.getUnreadCount(userId);
  }
}
