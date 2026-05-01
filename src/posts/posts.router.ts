import express from 'express';
import { postsController } from './posts.module';

const postsRouter = express.Router();

//--> /posts
postsRouter.post('/',postsController.createPost.bind(postsController));
postsRouter.put('/:id', postsController.updatePost.bind(postsController));
postsRouter.delete('/:id', postsController.deletePost.bind(postsController));
postsRouter.get('/:id', postsController.getPostById.bind(postsController));
postsRouter.get('/', postsController.getAllPosts.bind(postsController));

export default postsRouter;