import { Database } from '../config/database';
import { ICreatePost, IPost, IPostsRepository } from './posts.entity';

export default class PostsRepository implements IPostsRepository {
  constructor(private readonly db: Database) {}

  async create(payload: ICreatePost): Promise<IPost> {
    const query = `INSERT INTO posts (title, content,user_id) VALUES ($1, $2, $3) RETURNING *`;
    const { rows } = await this.db.query<IPost>(query, [payload.title, payload.content, payload.user_id]);
    return rows[0];
  }

  async update(id: string, payload: ICreatePost): Promise<IPost> {
    const query = `UPDATE posts SET title = $1, content = $2 WHERE id = $3 RETURNING *`;
    const { rows } = await this.db.query<IPost>(query, [payload.title, payload.content, id]);
    return rows[0];
  }
  async delete(id: string): Promise<void> {
    const query = `UPDATE posts SET status=$1 WHERE id = $2 RETURNING *`;
   const { rows } = await this.db.query(query, ['deleted', id]);
    return rows[0];
  }
  async findById(id: string): Promise<IPost[]> {
    const query = `SELECT * FROM posts WHERE user_id = $1 AND status != $2`;
    const { rows } = await this.db.query<IPost>(query, [id, 'deleted']);
    if (rows.length === 0) {
      return [];
    }
    return rows;
  }
  async findAll(): Promise<IPost[]> {
    const query = `SELECT * FROM posts WHERE status != $1`;
    const { rows } = await this.db.query<IPost>(query, ['deleted']);
    return rows;
  }
}
