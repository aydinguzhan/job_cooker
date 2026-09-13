import express from 'express';
import { userController } from './user.module';
import { createUserSchema } from '../schema/user.schema';
import { validate } from '../../middleware/validate.middleware';
import { authMiddleware } from '../../middleware/auth.middeware';

const router = express.Router();

// --> /users
router.get('/search', authMiddleware, userController.getUserFilterName.bind(userController));
router.get('/:id', authMiddleware, userController.getUser.bind(userController));
router.post(
  '/',
  authMiddleware,
  validate(createUserSchema),
  userController.createUser.bind(userController)
);
router.put('/', authMiddleware, userController.updatedUser.bind(userController));
router.delete('/', authMiddleware, userController.deleteUser.bind(userController));

export default router;
