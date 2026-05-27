import { IBaseUser, IUpdateUser, IUserRepository, IWithPassword } from './user.entity';
import { Database } from '../config/database';

export default class UserRepository implements IUserRepository {
  constructor(private readonly db: Database) {}
  async post(payload: IBaseUser & { password_hash: string }) {
    try {
      const { rows } = await this.db.query<IBaseUser & { password_hash: string }>(
        `
      INSERT INTO users (
        first_name,
        last_name,
        email,
        password_hash,
        role_id
      )
      VALUES (
        $1,
        $2,
        $3,
        $4,
        (
          SELECT id
          FROM roles
          WHERE role = 'user'
          AND deleted_at IS NULL
        )
      )
      RETURNING *
      `,
        [payload.first_name, payload.last_name, payload.email, payload.password_hash]
      );

      return rows[0];
    } catch (e) {
      console.log(e);
      return {} as IBaseUser;
    }
  }
  async put(payload: IBaseUser): Promise<IUpdateUser> {
    const { rows } = await this.db.query(
      `UPDATE users SET (first_name,last_name,email) VALUES ($1, $2, $3) RETURNING * WHERE id = $4?`,
      [payload.first_name, payload.last_name, payload.email, payload.id]
    );
    return rows[0];
  }
  async get(id: string): Promise<IBaseUser> {
    const { rows } = await this.db.query<IBaseUser & IWithPassword>(
      `SELECT id,first_name, last_name, email, password_hash, role_id FROM users WHERE users.id = $1`,
      [id]
    );
    if (rows.length === 0) {
      throw new Error('No users found.');
    }
    return rows[0];
  }
  async getUserForEmail(email: string) {
    const { rows, rowCount } = await this.db.query(
      'SELECT id, email, first_name, last_name, role_id FROM users WHERE users.email = $1',
      [email]
    );
    if (!rowCount) throw new Error('User is not find!');
    return rows[0];
  }
  async delete(id: string): Promise<void> {
    const { rows } = await this.db.query(
      `UPDATE users SET is_active = false WHERE id = $1 RETURNING *`,
      [id]
    );
    if (rows.length === 0) throw new Error('User is not find!');
    return rows[0];
  }
}
