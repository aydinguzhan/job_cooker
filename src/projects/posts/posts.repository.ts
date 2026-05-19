import { Database } from '../config/database';
import {
  ICreatePost,
  IDeletePostComment,
  IPost,
  IPostComment,
  IPostCreatedCommentResponse,
  IPostsLike,
  IPostsRepository,
  IUpdatePostComment,
} from './posts.entity';

export default class PostsRepository implements IPostsRepository {
  constructor(private readonly db: Database) {}

  async create(payload: ICreatePost): Promise<IPost> {
    const query = `INSERT INTO posts (title, content,user_id) VALUES ($1, $2, $3) RETURNING *`;
    const { rows } = await this.db.query<IPost>(query, [
      payload.title,
      payload.content,
      payload.user_id,
    ]);
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
  async findAll(user_id: string): Promise<IPost[]> {
    const query = `
                SELECT
                p.id,
                p.title,
                p.content,
                p.user_id,
                p.created_at,
                (u.first_name || ' ' || u.last_name) AS full_name,

                CASE
                  WHEN pl.id IS NULL THEN false
                  ELSE true
                END AS islike,

                COUNT(pc.id)::INTEGER AS comment_count

              FROM posts p

              LEFT JOIN users u
              ON p.user_id = u.id

              LEFT JOIN post_likes pl
              ON p.id = pl.post_id
              AND pl.user_id = $1

              LEFT JOIN post_comments pc
              ON pc.post_id = p.id
              AND pc.deleted_at IS NULL

              WHERE p.user_id = $1
              AND p.deleted_at IS NULL

              GROUP BY
                p.id,
                u.first_name,
                u.last_name,
                pl.id

              ORDER BY p.created_at DESC;`;
    const { rows } = await this.db.query<IPost>(query, [user_id]);
    return rows;
  }

  async createComment(payload: IPostComment): Promise<IPostCreatedCommentResponse> {
    const { post_id, user_id, content } = payload;
    const query = `INSERT INTO post_comments (post_id, user_id, content) VALUES ($1, $2, $3) RETURNING *`;

    const { rows } = await this.db.query(query, [post_id, user_id, content]);

    return rows[0];
  }
  async getAllComments(post_id: string) {
    const query = `SELECT post_id,user_id,content,created_at,updated_at FROM post_comments pc WHERE pc.post_id = $1`;
    const { rows } = await this.db.query(query, [post_id]);
    return rows;
  }

  async updateComment(payload: IUpdatePostComment): Promise<IPostCreatedCommentResponse> {
    const query = `
    UPDATE post_comments
    SET content = $1
    WHERE id = $2
      AND user_id = $3
      AND deleted_at IS NULL
    RETURNING *;
  `;

    const { rows } = await this.db.query<IPostCreatedCommentResponse>(query, [
      payload.content,
      payload.comment_id,
      payload.user_id,
    ]);

    if (!rows[0]) {
      throw new Error('Comment not found or you are not allowed to update it');
    }

    return rows[0];
  }

  async deleteComment(
    id: string,
    payload: IDeletePostComment
  ): Promise<IPostCreatedCommentResponse> {
    const query = `
    UPDATE post_comments
    SET deleted_at = CURRENT_TIMESTAMP
    WHERE id = $1
      AND user_id = $2
      AND deleted_at IS NULL
    RETURNING *;
  `;

    const { rows } = await this.db.query<IPostCreatedCommentResponse>(query, [id, payload.user_id]);

    if (!rows[0]) {
      throw new Error('Comment not found or you are not allowed to delete it');
    }

    return rows[0];
  }

  async isLike(post_id: string, user_id: string): Promise<boolean> {
    const query = `
    SELECT id
    FROM post_likes
    WHERE post_id = $1
    AND user_id = $2
  `;

    const { rows } = await this.db.query(query, [post_id, user_id]);

    return rows.length > 0;
  }

  async createLike(payload: IPostsLike) {
    const isLiked = await this.isLike(payload.post_id, payload.user_id);

    if (isLiked) {
      const deleteQuery = `
      DELETE FROM post_likes
      WHERE user_id = $1
      AND post_id = $2
      RETURNING *
    `;

      const { rows } = await this.db.query(deleteQuery, [payload.user_id, payload.post_id]);

      return {
        liked: false,
        data: rows[0],
      };
    }

    const insertQuery = `
    INSERT INTO post_likes (
      user_id,
      post_id
    )
    VALUES ($1, $2)
    RETURNING *
  `;

    const { rows } = await this.db.query(insertQuery, [payload.user_id, payload.post_id]);

    return {
      liked: true,
      data: rows[0],
    };
  }

  async deleteLike(id: string) {
    const query = 'DELETE FROM post_likes WHERE id = $1';

    const { rows } = await this.db.query(query, [id]);
    return rows;
  }

  async getpostDashboard() {
    const query = `
    SELECT 
    p.id,
    p.title,
    p.content,
    p.created_at
    CONCAT(u.first_name,' ', u.last_name),
    (
    SELECT COUNT(*)
    FROM post_likes pl
    WHERE pl.post_id = p.id
  ) AS like_counti

  (
  SELECT COUNT(*)
  FROM post_comments pc
  WHERE pc.post_id _ p.id
  AND pc.deleted_at IS NULL
  ) AS comment_count,

  FROM posts p 
  JOIN users u ON u.id = p.user_id
  WHERE p.deleted_At IS NULL
  AND p.status = 'published'
  ORDER BY p.created_at DESC;ˆ
   `;
  }
}
