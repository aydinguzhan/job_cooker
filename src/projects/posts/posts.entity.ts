export interface IPostsRepository {
    create(payload: ICreatePost): Promise<IPost>;
    update(id: string, payload: IUpdatePost): Promise<IPost>;
    delete(id: string): Promise<void>;
    findById(id: string): Promise<IPost | null>;
    findAll(): Promise<IPost[]>;
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