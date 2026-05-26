import { NextFunction, Request, Response } from 'express';
import PostsService from './posts.service';
import { ICreatePost, IDeletePostComment, IUpdatePostComment } from './posts.entity';
import { errorResponse, successResponse } from '../../utils/response';
import { jwtttoUserId } from '../../utils/jwt';

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

  async getAllPosts(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = jwtttoUserId(req);
      const posts = await this.postsService.getAllPosts(userId as string);
      return successResponse(res, posts);
    } catch (error) {
      next(error);
    }
  }
  async findByPostId(req: Request, res: Response) {
    const { postId } = req.params;
    const post = await this.postsService.findByPostId(postId as string);
    if (!post) {
      return res.status(404).send();
    }
    return successResponse(res, post);
  }
  async createComment(req: Request, res: Response) {
    const payload = req.body;

    const userId = jwtttoUserId(req);
    const comment = await this.postsService.createComment({ ...payload, user_id: userId });
    if (comment) return successResponse(res, comment, 'Succesfuly', 201);
    return errorResponse(res, 'Fail', 400);
  }

  async createLike(req: Request, res: Response) {
    const payload = req.body;
    const like = await this.postsService.createLike(payload);
    return successResponse(res, like);
  }
  async updateComment(req: Request, res: Response) {
    const payload: IUpdatePostComment = req.body;
    const updatedComment = await this.postsService.updateComment(payload);
    if (updatedComment) return successResponse(res, updatedComment);
    return errorResponse(res, 'Comment is not found!');
  }
  async deleteComment(req: Request, res: Response) {
    const payload: IDeletePostComment = req.body;
    const { postId } = req.params;
    const deletedComment = await this.postsService.deleteComment(postId as string, payload);
    if (deletedComment) return successResponse(res, deletedComment);
    return errorResponse(res, 'Comment is not found!');
  }
  async getAllComments(req: Request, res: Response) {
    const { postId } = req.params;

    const comments = await this.postsService.getAllComments(postId as string);

    return successResponse(res, comments);
  }
}
