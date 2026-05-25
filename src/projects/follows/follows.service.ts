import FollowsRepository from "./follows.repository";
import type { FollowRelation, FollowUser } from "./follows.entitiy";

export default class FollowsService {
  constructor(private readonly followsRepository: FollowsRepository) {}

  async follow(
    followerId: string,
    followingId: string
  ): Promise<FollowRelation> {
    if (followerId === followingId) {
      throw new Error("You cannot follow yourself");
    }

    return await this.followsRepository.follow(followerId, followingId);
  }

  async unfollow(
    followerId: string,
    followingId: string
  ): Promise<FollowRelation | null> {
    if (followerId === followingId) {
      throw new Error("You cannot unfollow yourself");
    }

    return await this.followsRepository.unfollow(followerId, followingId);
  }

  async getFollowers(userId: string): Promise<FollowUser[]> {
    return await this.followsRepository.getFollowers(userId);
  }

  async getFollowings(userId: string): Promise<FollowUser[]> {
    return await this.followsRepository.getFollowings(userId);
  }

  async getSuggestions(userId: string): Promise<FollowUser[]> {
    return await this.followsRepository.getSuggestions(userId);
  }
}