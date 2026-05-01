import { ICreatePost, IPost } from "./posts.entity";
import PostsRepository from "./posts.repository";

export default class PostsService {
  constructor(private postsRepository: PostsRepository) {}

  async createPost(payload: ICreatePost): Promise<IPost> {
    return this.postsRepository.create(payload);
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