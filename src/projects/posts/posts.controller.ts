import { Request, Response } from 'express';
import  PostsService  from './posts.service';
import { ICreatePost } from './posts.entity';
import { successResponse } from '../../utils/response';
export default class PostsController {
  constructor(private postsService: PostsService) {}

  async createPost(req: Request, res: Response) {
    const payload: ICreatePost = req.body;
    const post = await this.postsService.createPost(payload);
    return res.status(201).json(post);
  }

  async updatePost(req: Request, res: Response) {
    const id = req.params.id;
    const payload: ICreatePost = req.body;
    const post = await this.postsService.updatePost(id as string, payload);
    return res.status(200).json(post);
  }

  async deletePost(req: Request, res: Response) {
    const id = req.params.id;
    await this.postsService.deletePost(id as string);
    return res.status(204).send();
  }

  async getPostById(req: Request, res: Response) {
    const id = req.params.id;
    const post = await this.postsService.getPostById(id as string);
    if (!post) {
      return res.status(404).send();
    }
    return successResponse(res, post);
  }

  async getAllPosts(req: Request, res: Response) {
    const posts = await this.postsService.getAllPosts();
    return successResponse(res, posts);
  }
}
