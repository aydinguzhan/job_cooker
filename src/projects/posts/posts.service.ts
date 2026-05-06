import { publishEmailNotificationJob } from '../../rabbit/publisher/email.publisher';
import { publishNotificationJob } from '../../rabbit/publisher/notification.publisher';
import { ICreatePost, IPost } from './posts.entity';
import PostsRepository from './posts.repository';

export default class PostsService {
  constructor(private postsRepository: PostsRepository) {}

  async createPost(payload: ICreatePost): Promise<IPost> {
    const results = await this.postsRepository.create(payload);
    try {
      await publishNotificationJob({
        receiver_id: payload.user_id,
        actor_id: payload.user_id,
        type: 'POST_CREATED',
        entity_type: 'post',
        entity_id: results.id,
        message: payload.content,
      });
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
    return this.postsRepository.update(id, payload);
  }

  async deletePost(id: string): Promise<void> {
    return this.postsRepository.delete(id);
  }

  async getPostById(id: string): Promise<IPost | null> {
    return this.postsRepository.findById(id);
  }

  async getAllPosts(): Promise<IPost[]> {
    return this.postsRepository.findAll();
  }
}
