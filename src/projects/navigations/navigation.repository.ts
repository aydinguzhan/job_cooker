import { Database } from '../config/database';
import { INavigationEntitiy } from './navigations.entity';

export default class NavigatorRepository implements INavigationEntitiy {
  constructor(private readonly db: Database) {}
  async get(user_id: string) {
    const queryUser = `
    SELECT
      n.id,
      n.label,
      n.icon,
      n.route_link as path
    FROM users u
    JOIN role_navigator rn ON rn.role_id = u.role_id
    JOIN navigator n ON n.id = rn.navigator_id
    WHERE u.id = $1
    AND u.deleted_at IS NULL
    AND n.deleted_at IS NULL`;
    try {
      const { rows } = await this.db.query(queryUser, [user_id]);
      return rows;
    } catch (error) {
      console.error('Error fetching navigations', error);
      throw error;
    }
  }
}
