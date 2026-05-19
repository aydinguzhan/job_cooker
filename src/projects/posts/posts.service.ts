import AppError from '../../errors/AppError';
import { publishEmailNotificationJob } from '../../rabbit/publisher/email.publisher';
import {
  ICreatePost,
  IDeletePostComment,
  IPost,
  IPostComment,
  IPostCreatedCommentResponse,
  IPostsLike,
  IUpdatePostComment,
} from './posts.entity';
import PostsRepository from './posts.repository';

export default class PostsService {
  constructor(private postsRepository: PostsRepository) {}

  async createPost(payload: ICreatePost): Promise<IPost> {
    const results = await this.postsRepository.create(payload);
    try {
      // await publishNotificationJob({
      //   receiver_id: payload.user_id,
      //   actor_id: payload.user_id,
      //   type: 'POST_CREATED',
      //   entity_type: 'post',
      //   entity_id: results.id,
      //   message: payload.content,
      // });
      await publishEmailNotificationJob({
        receiver_id: payload.user_id,
        actor_id: payload.user_id,
        type: 'POST_CREATED',
        entity_type: 'post',
        entity_id: results.id,
        message: payload.content,
      });
    } catch (error) {
      console.error('Notification publish failed:', error);
    }

    return results;
  }

  async updatePost(id: string, payload: ICreatePost): Promise<IPost> {
    if (id) throw new AppError('User is must.', 400, 'User info is missing');
    return this.postsRepository.update(id, payload);
  }

  async deletePost(id: string): Promise<void> {
    return this.postsRepository.delete(id);
  }

  async getPostById(id: string): Promise<IPost[] | null> {
    return this.postsRepository.findById(id);
  }

  async getAllPosts(user_id: string): Promise<IPost[]> {
    return this.postsRepository.findAll(user_id);
  }
  async createComment(payload: IPostComment): Promise<IPostCreatedCommentResponse> {
    const results = await this.postsRepository.createComment(payload);
    return results;
  }
  async createLike(payload: IPostsLike) {
    const results = await this.postsRepository.createLike(payload);
    return results;
  }
  async updateComment(payload: IUpdatePostComment): Promise<IPostCreatedCommentResponse> {
    const results = await this.postsRepository.updateComment(payload);
    return results;
  }
  async deleteComment(
    id: string,
    payload: IDeletePostComment
  ): Promise<IPostCreatedCommentResponse> {
    const results = await this.postsRepository.deleteComment(id, payload);
    return results;
  }
  async getAllComments(post_id: string) {
    const results = await this.postsRepository.getAllComments(post_id);
    return results;
  }
}
