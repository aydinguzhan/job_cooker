import { Router } from 'express';
import MessageController from './message.controller';
import { authMiddleware } from '../../middleware/auth.middeware';

export default function createMessageRouter(messageController: MessageController) {
  const router = Router();

  router.use(authMiddleware);

  router.post('/conversations', messageController.createConversation);

  router.get('/conversations', messageController.getUserConversations);

  router.get('/conversations/:conversationId/messages', messageController.getConversationMessages);

  router.post('/', messageController.createMessage);

  router.patch('/messages/:messageId/read', messageController.markMessageAsRead);

  router.patch('/conversations/:conversationId/read', messageController.markConversationAsRead);

  router.get('/unread-count', messageController.getUnreadCount);

  return router;
}
