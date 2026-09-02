import type { Request, Response } from 'express';

import MessageService from './message.service';
import { jwtttoUserId } from '../../utils/jwt';
import { errorResponse } from '../../utils/response';

export default class MessageController {
  constructor(private readonly messageService: MessageService) {}

  createConversation = async (req: Request, res: Response) => {
    try {
      const userId = jwtttoUserId(req);

      const conversation = await this.messageService.createConversation({
        subject: req.body.subject ?? null,
        members: [...new Set([...(req.body.members ?? []), userId])],
      });

      return res.status(201).json({
        success: true,
        data: conversation,
      });
    } catch (error: unknown) {
      console.error(error);

      return errorResponse(res, error instanceof Error ? error.message : 'Internal server error');
    }
  };

  getUserConversations = async (req: Request, res: Response) => {
    try {
      const userId = jwtttoUserId(req);

      const conversations = await this.messageService.getUserConversations(userId);

      return res.status(200).json({
        success: true,
        data: conversations,
      });
    } catch (error: unknown) {
      console.error(error);

      return errorResponse(res, error instanceof Error ? error.message : 'Internal server error');
    }
  };

  getConversationMessages = async (req: Request, res: Response) => {
    try {
      const userId = jwtttoUserId(req);

      const { conversationId } = req.params;
      if (Array.isArray(conversationId)) {
        return errorResponse(res, 'Invalid conversation id', 400);
      }

      if (!conversationId) {
        return errorResponse(res, 'Conversation id is required', 400);
      }
      const startFrom = Number(req.query.startFrom ?? 0);
      const count = Number(req.query.count ?? 20);

      const isMember = await this.messageService.isConversationMember(
        conversationId as string,
        userId
      );

      if (!isMember) {
        return res.status(403).json({
          success: false,
          message: 'You are not a member of this conversation',
        });
      }

      const messages = await this.messageService.getConversationMessages({
        conversationId,
        startFrom,
        count,
      });

      return res.status(200).json({
        success: true,
        data: messages,
      });
    } catch (error: unknown) {
      return errorResponse(res, error instanceof Error ? error.message : 'Internal server error');
    }
  };

  createMessage = async (req: Request, res: Response) => {
    try {
      const userId = jwtttoUserId(req);

      const { conversation_id, body } = req.body;

      const isMember = await this.messageService.isConversationMember(conversation_id, userId);

      if (!isMember) {
        return res.status(403).json({
          success: false,
          message: 'You are not a member of this conversation',
        });
      }

      const message = await this.messageService.createMessage({
        conversation_id,
        sender_id: userId,
        body,
      });

      return res.status(201).json({
        success: true,
        data: message,
      });
    } catch (error: unknown) {
      return errorResponse(res, error instanceof Error ? error.message : 'Internal server error');
    }
  };

  markMessageAsRead = async (req: Request, res: Response) => {
    try {
      const userId = jwtttoUserId(req);

      const { messageId } = req.params;
      if (Array.isArray(messageId)) {
        return errorResponse(res, 'Invalid conversation id', 400);
      }

      if (!messageId) {
        return errorResponse(res, 'Conversation id is required', 400);
      }

      await this.messageService.markMessageAsRead({
        messageId,
        userId,
      });

      return res.status(200).json({
        success: true,
      });
    } catch (error: unknown) {
      return errorResponse(res, error instanceof Error ? error.message : 'Internal server error');
    }
  };

  markConversationAsRead = async (req: Request, res: Response) => {
    try {
      const userId = jwtttoUserId(req);

      const { conversationId } = req.params;
      if (Array.isArray(conversationId)) {
        return errorResponse(res, 'Invalid conversation id', 400);
      }

      if (!conversationId) {
        return errorResponse(res, 'Conversation id is required', 400);
      }

      const isMember = await this.messageService.isConversationMember(conversationId, userId);

      if (!isMember) {
        return res.status(403).json({
          success: false,
          message: 'You are not a member of this conversation',
        });
      }

      await this.messageService.markConversationAsRead({
        conversationId,
        userId,
      });

      return res.status(200).json({
        success: true,
      });
    } catch (error: unknown) {
      return errorResponse(res, error instanceof Error ? error.message : 'Internal server error');
    }
  };

  getUnreadCount = async (req: Request, res: Response) => {
    try {
      const userId = jwtttoUserId(req);

      const count = await this.messageService.getUnreadCount(userId);

      return res.status(200).json({
        success: true,
        data: {
          count,
        },
      });
    } catch (error: unknown) {
      return errorResponse(res, error instanceof Error ? error.message : 'Internal server error');
    }
  };
}
