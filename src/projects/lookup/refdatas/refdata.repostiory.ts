import { Database } from '../../config/database';
import { IRefdata, IRefdataEntity } from './refdata.entity';

export default class RefdataRepository implements IRefdataEntity {
  constructor(private readonly db: Database) {}
  async getSkills() {
    const query = `SELECT id, name, short_key from skills`;
    const { rows } = await this.db.query<IRefdata>(query);
    return rows;
  }
}
