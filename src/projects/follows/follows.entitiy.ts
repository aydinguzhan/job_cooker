export interface IFollowEntitiy {
    follow(followerId: string, followingId: string): Promise<void>;
    unfollow(followerId: string, followingId: string): Promise<void>;
    getFollowers(userId: string): Promise<string[]>;
    getFollowings(userId: string): Promise<string[]>;
}

export type FollowRelation = {
  id: string;
  follower_id: string;
  following_id: string;
  status: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
};

export type FollowUser = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  title: string | null;
  profile_image_path: string | null;
  is_following: boolean;
};

export interface IFollowEntity {
  follow(followerId: string, followingId: string): Promise<FollowRelation>;
  unfollow(
    followerId: string,
    followingId: string
  ): Promise<FollowRelation | null>;
  getFollowers(userId: string): Promise<FollowUser[]>;
  getFollowings(userId: string): Promise<FollowUser[]>;
  getSuggestions(userId: string): Promise<FollowUser[]>;
}