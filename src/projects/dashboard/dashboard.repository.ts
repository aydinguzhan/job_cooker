import { Database } from '../config/database';
import { IPost } from '../posts/posts.entity';
import { IDashboardEntitiy, IGetFeeds } from './dashboard.entitiy';

export class DashboardRepository implements IDashboardEntitiy {
  constructor(private readonly db: Database) {}
  async get(payload: IGetFeeds): Promise<IPost[]> {
    const query = `
    SELECT
      p.id,
      p.user_id,
      p.title,
      p.content,
      p.status,
      p.created_at,
      p.updated_at,
      (u.first_name || ' ' || u.last_name) AS full_name,
      up.profile_image_path,
      COUNT(DISTINCT pl.id)::INTEGER AS like_count,
      COUNT(DISTINCT pc.id)::INTEGER AS comment_count,
      CASE
        WHEN my_like.id IS NULL THEN false
        ELSE true
      END AS islike
    FROM posts p
    JOIN users u
      ON u.id = p.user_id
    LEFT JOIN user_profiles up
      ON up.user_id = u.id
      AND up.deleted_at IS NULL

    LEFT JOIN post_likes pl
      ON pl.post_id = p.id

    LEFT JOIN post_comments pc
      ON pc.post_id = p.id
      AND pc.deleted_at IS NULL

    LEFT JOIN post_likes my_like
      ON my_like.post_id = p.id
      AND my_like.user_id = $1

    WHERE p.deleted_at IS NULL
      AND p.status = 'published'
      AND (
        p.user_id = $1
        OR p.user_id IN (
          SELECT following_id
          FROM user_follows
          WHERE follower_id = $1
            AND status = true
            AND deleted_at IS NULL
        )
      )

    GROUP BY
      p.id,
      u.id,
      up.profile_image_path,
      my_like.id

    ORDER BY p.created_at DESC

    LIMIT $2
    OFFSET $3;
    `;

    const { rows } = await this.db.query(query, [payload.userId, payload.limit, payload.offset]);

    return rows as IPost[];
  }
}
