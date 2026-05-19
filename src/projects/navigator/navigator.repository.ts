import { Database } from '../config/database';
import { INavgatorEntitiy, INavigatorItem } from './navigator.entity';

export default class NavigatorRepository implements INavgatorEntitiy {
  constructor(private readonly db: Database) {}
  async get(role: string) {
    const query = `SELECT label, routeLink, icon FROM navigator WHERE navigator.role = $1 ; `;

    const { rows } = await this.db.query(query, [role]);
    return rows as INavigatorItem[];
  }
}
