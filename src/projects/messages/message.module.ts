import createMessageRouter from './message.router';
import MessageController from './message.controller';
import MessageService from './message.service';
import { MessageRepository } from './message.repository';
import { db } from '../config/database';

const messageRepository = new MessageRepository(db);
const messageService = new MessageService(messageRepository);
const messageController = new MessageController(messageService);

export const messageRouter = createMessageRouter(messageController);