import AppError from '../../errors/AppError';
import { publishEmailNotificationJob } from '../../rabbit/publisher/email.publisher';
import { publishNotificationJob } from '../../rabbit/publisher/notification.publisher';
import { FollowUser } from '../follows/follows.entitiy';
import FollowsService from '../follows/follows.service';
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
  constructor(
    private postsRepository: PostsRepository,
    private readonly followsService: FollowsService
  ) {}

  async createPost(payload: ICreatePost): Promise<IPost> {
    const results = await this.postsRepository.create(payload);
    console.log('Post created with ID:', payload);
    const followers :FollowUser[] = await this.followsService.getFollowers(payload.user_id) ;
    try {
      if (followers.length > 0) {
        for (const follow of followers) {
          publishNotificationJob({
            receiver_id: follow.id,
            actor_id: payload.user_id,
            type: 'post_created',
            entity_type: 'post',
            entity_id: results.id,
            message: payload.content,
            title: payload.title,
          });
        }
      }
    } catch (error) {
      console.error('Notification create failed:', error);
    }

    try {
      await publishEmailNotificationJob({
        receiver_id: payload.user_id,
        actor_id: payload.user_id,
        type: 'POST_CREATED',
        entity_type: 'post',
        entity_id: results.id,
        message: payload.content,
        title : payload.title
      });
    } catch (error) {
      console.error('Email notification publish failed:', error);
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
  async findByPostId(post_id: string): Promise<IPost | null> {
    return this.postsRepository.findByPostId(post_id);
  }

  async getAllPosts(user_id: string): Promise<IPost[]> {
    return this.postsRepository.findAll(user_id);
  }
  async getSavedPosts(user_id: string): Promise<IPost[]> {
    return this.postsRepository.getSavedPosts(user_id);
  }
  async createComment(payload: IPostComment): Promise<IPostCreatedCommentResponse> {
    const results = await this.postsRepository.createComment(payload);

    try {
      const post = await this.postsRepository.findByPostId(payload.post_id);

      if (post && post.user_id !== payload.user_id) {
        publishNotificationJob({
          receiver_id: post.user_id,
          actor_id: payload.user_id,
          type: 'comment',
          entity_type: 'post',
          entity_id: payload.post_id,
          title: post.title,
          message: results.content,
        });
      }
    } catch (error) {
      console.error('Comment notification publish failed:', error);
    }

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

  async postSave(post_id: string, user_id: string) {
    const results = await this.postsRepository.postSave(post_id, user_id);
    return results;
  }
  async postUnsave(post_id: string, user_id: string) {
    const results = await this.postsRepository.postUnsave(post_id, user_id);
    return results;
  }
  async postSaveDelete(post_id: string, user_id: string) {
    const results = await this.postsRepository.deleteSavedPost(post_id, user_id);
    return results;
  }
}
