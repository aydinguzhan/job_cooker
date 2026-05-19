export interface IPostsRepository {
    create(payload: ICreatePost): Promise<IPost>;
    update(id: string, payload: IUpdatePost): Promise<IPost>;
    delete(id: string): Promise<void>;
    findById(id: string): Promise<IPost[] | null>;
    findAll(user_id:string): Promise<IPost[]>;
    createComment(payload : IPostComment): Promise<IPostCreatedCommentResponse>
}

export interface IBaseEntity {
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}
export interface IPost {
    id: string;
    title: string;
    content: string;
    user_id: string;
    created_at: Date;
    updated_at: Date;
}
export interface ICreatePost {
    title: string;
    content: string;
    user_id: string;
}
export interface IUpdatePost {
    title?: string;
    content?: string;
    user_id?: string;
}

export interface IPostComment{
    post_id: string,
    user_id : string,
    content : string
}
export interface IUpdatePostComment {
  comment_id: string;
  user_id: string;
  content: string;
}
export interface IDeletePostComment {
  user_id: string;
  content: string;
}
export interface IPostCreatedCommentResponse
  extends IPostComment,
    IBaseEntity {}

export interface IPostsLike {
  post_id :string;
  user_id :string
}
