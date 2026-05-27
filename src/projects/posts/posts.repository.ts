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
  async findByPostId(post_id: string): Promise<IPost | null> {
    const query = `
      SELECT
        p.id,
        p.title,
        p.content,
        p.user_id,
        p.status,
        p.created_at,
        p.updated_at,
        (u.first_name || ' ' || u.last_name) AS full_name,
        up.profile_image_path,
        COUNT(DISTINCT pl.id)::INTEGER AS like_count,
        COUNT(DISTINCT pc.id)::INTEGER AS comment_count
      FROM posts p
      LEFT JOIN users u
      ON p.user_id = u.id
      LEFT JOIN user_profiles up
      ON up.user_id = u.id
      AND up.deleted_at IS NULL
      LEFT JOIN post_likes pl
      ON p.id = pl.post_id
      LEFT JOIN post_comments pc
      ON pc.post_id = p.id
      AND pc.deleted_at IS NULL
      WHERE p.id = $1
      AND p.status != $2
      GROUP BY
        p.id,
        u.first_name,
        u.last_name,
        up.profile_image_path
    `;
    const { rows } = await this.db.query<IPost>(query, [post_id, 'deleted']);
    if (rows.length === 0) {
      return null;
    }
    return rows[0];
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
                up.profile_image_path,

                CASE
                  WHEN pl.id IS NULL THEN false
                  ELSE true
                END AS islike,

                COUNT(pc.id)::INTEGER AS comment_count

              FROM posts p

              LEFT JOIN users u
              ON p.user_id = u.id

              LEFT JOIN user_profiles up
              ON up.user_id = u.id
              AND up.deleted_at IS NULL

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
                up.profile_image_path,
                pl.id

              ORDER BY p.created_at DESC;`;
    const { rows } = await this.db.query<IPost>(query, [user_id]);
    return rows;
  }

  async getSavedPosts(user_id: string): Promise<IPost[]> {
    const query = `
      SELECT
        p.id,
        p.title,
        p.content,
        p.user_id,
        p.created_at,
        p.updated_at,
        p.status,
        (u.first_name || ' ' || u.last_name) AS full_name,
        up.profile_image_path,
        COUNT(DISTINCT pl_all.id)::INTEGER AS like_count,
        COUNT(DISTINCT pc.id)::INTEGER AS comment_count,
        CASE
          WHEN pl_me.id IS NULL THEN false
          ELSE true
        END AS islike
      FROM post_saves ps
      INNER JOIN posts p
      ON ps.post_id = p.id
      LEFT JOIN users u
      ON p.user_id = u.id
      LEFT JOIN user_profiles up
      ON up.user_id = u.id
      AND up.deleted_at IS NULL
      LEFT JOIN post_likes pl_all
      ON p.id = pl_all.post_id
      LEFT JOIN post_likes pl_me
      ON p.id = pl_me.post_id
      AND pl_me.user_id = $1
      LEFT JOIN post_comments pc
      ON p.id = pc.post_id
      AND pc.deleted_at IS NULL
      WHERE ps.user_id = $1
      AND ps.status = true
      AND ps.deleted_at IS NULL
      AND p.deleted_at IS NULL
      AND p.status != 'deleted'
      GROUP BY
        p.id,
        u.first_name,
        u.last_name,
        up.profile_image_path,
        pl_me.id
      ORDER BY MAX(ps.created_at) DESC
    `;

    const { rows } = await this.db.query<IPost>(query, [user_id]);
    return rows;
  }

  async createComment(payload: IPostComment): Promise<IPostCreatedCommentResponse> {
    const { post_id, user_id, content } = payload;
    const query = `
      INSERT INTO post_comments (post_id, user_id, content)
      VALUES ($1, $2, $3)
      RETURNING id, post_id, user_id, content, created_at, updated_at
    `;

    const { rows } = await this.db.query(query, [post_id, user_id, content]);

    const createdComment = rows[0];

    const commentDetailQuery = `
      SELECT
        pc.id,
        pc.post_id,
        pc.user_id,
        pc.content,
        pc.created_at,
        pc.updated_at,
        (u.first_name || ' ' || u.last_name) AS full_name,
        up.profile_image_path
      FROM post_comments pc
      LEFT JOIN users u
      ON pc.user_id = u.id
      LEFT JOIN user_profiles up
      ON up.user_id = u.id
      AND up.deleted_at IS NULL
      WHERE pc.id = $1
    `;

    const { rows: commentRows } = await this.db.query<IPostCreatedCommentResponse>(
      commentDetailQuery,
      [createdComment.id]
    );

    return commentRows[0];
  }
  async getAllComments(post_id: string) {
    const query = `
      SELECT
        pc.id,
        pc.post_id,
        pc.user_id,
        pc.content,
        pc.created_at,
        pc.updated_at,
        (u.first_name || ' ' || u.last_name) AS full_name,
        up.profile_image_path
      FROM post_comments pc
      LEFT JOIN users u
      ON pc.user_id = u.id
      LEFT JOIN user_profiles up
      ON up.user_id = u.id
      AND up.deleted_at IS NULL
      WHERE pc.post_id = $1
      ORDER BY pc.created_at DESC
    `;
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

  async postSave(post_id: string, user_id: string) {
    const query = `
      INSERT INTO post_saves (post_id, user_id, status, deleted_at)
      VALUES ($1, $2, true, NULL)
      ON CONFLICT (post_id, user_id)
      DO UPDATE SET
        status = true,
        deleted_at = NULL
      RETURNING *
    `;

    const { rows } = await this.db.query(query, [post_id, user_id]);
    return rows[0];
  }

  async postUnsave(post_id: string, user_id: string) {
    const query = `
      UPDATE post_saves
      SET status = false
      WHERE post_id = $1
      AND user_id = $2
      RETURNING *
    `;

    const { rows } = await this.db.query(query, [post_id, user_id]);
    return rows[0];
  }

  async deleteSavedPost(post_id: string, user_id: string) {
    const query = `
      DELETE FROM post_saves
      WHERE post_id = $1
      AND user_id = $2
      RETURNING *
    `;

    const { rows } = await this.db.query(query, [post_id, user_id]);
    return rows[0];
  }
}
