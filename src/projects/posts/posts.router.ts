import express from 'express';
import { postsController } from './posts.module';
import { authMiddleware } from '../../middleware/auth.middeware';
import { validate } from '../../middleware/validate.middleware';
import { createPostSchema, updatePostSchema } from '../schema/post.schema';

const postsRouter = express.Router();

//--> /posts
postsRouter.post(
  '/',
  authMiddleware,
  validate(createPostSchema),
  postsController.createPost.bind(postsController)
);
postsRouter.put(
  '/:id',
  authMiddleware,
  validate(updatePostSchema),
  postsController.updatePost.bind(postsController)
);
postsRouter.delete('/:id', authMiddleware, postsController.deletePost.bind(postsController));
postsRouter.get('/:id', authMiddleware, postsController.getPostById.bind(postsController));
postsRouter.get('/', authMiddleware, postsController.getAllPosts.bind(postsController));

export default postsRouter;
