import { IPost } from "../posts/posts.entity";

export interface IDashboardEntitiy {
  get(payload: IGetFeeds): Promise<IPost[]>;
}

export interface IGetFeeds {
  userId: string;
  limit: number;
  offset: number;
}
