import express from 'express';
import { postsController } from './posts.module';
import { authMiddleware } from '../middleware/auth.middeware';

const postsRouter = express.Router();

//--> /posts
postsRouter.post('/' ,postsController.createPost.bind(postsController));
postsRouter.put('/:id', authMiddleware, postsController.updatePost.bind(postsController));
postsRouter.delete('/:id',authMiddleware, postsController.deletePost.bind(postsController));
postsRouter.get('/:id',authMiddleware, postsController.getPostById.bind(postsController));
postsRouter.get('/',authMiddleware, postsController.getAllPosts.bind(postsController));

export default postsRouter;