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
postsRouter.get('/save', authMiddleware, postsController.getSavedPosts.bind(postsController));
postsRouter.get('/detail/:postId', authMiddleware, postsController.findByPostId.bind(postsController));
postsRouter.get('/:user_id', authMiddleware, postsController.getAllPosts.bind(postsController));

postsRouter.post('/comment', authMiddleware, postsController.createComment.bind(postsController));
postsRouter.post('/save/:postId', authMiddleware, postsController.savePost.bind(postsController));
postsRouter.put('/save/:postId', authMiddleware, postsController.unsavePost.bind(postsController));
postsRouter.delete(
  '/save/:postId',
  authMiddleware,
  postsController.deleteSavedPost.bind(postsController)
);
postsRouter.get(
  '/comment/:postId',
  authMiddleware,
  postsController.getAllComments.bind(postsController)
);
postsRouter.put('/comment', authMiddleware, postsController.updateComment.bind(postsController));
postsRouter.put(
  '/comment/:postId',
  authMiddleware,
  postsController.deleteComment.bind(postsController)
);
postsRouter.post('/like/change', authMiddleware, postsController.createLike.bind(postsController));
postsRouter.put(
  '/:id',
  authMiddleware,
  validate(updatePostSchema),
  postsController.updatePost.bind(postsController)
);
postsRouter.delete('/:id', authMiddleware, postsController.deletePost.bind(postsController));
postsRouter.get('/:id', authMiddleware, postsController.getPostById.bind(postsController));

export default postsRouter;
