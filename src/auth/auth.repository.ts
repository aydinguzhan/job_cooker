import { Database } from '../config/database';
import { IAuthRepositry, ILogin, IRegister, IUser } from './auth.entity';
import bcrypt from 'bcrypt';

export default class AuthRepository implements IAuthRepositry {
  constructor(private readonly db: Database) {}
  async login(payload: ILogin): Promise<ILogin> {
    const { email } = payload;

    const { rowCount, rows } = await this.db.query(
      'SELECT id,email,password,role from users WHERE users.email = $1',
      [email]
    );

    if (!rowCount || rowCount === 0) {
      throw new Error('Registration not found for the user.');
    }
    return rows[0] || null;
  }
  async register(payload: IRegister): Promise<IUser> {
    const { email, first_name, last_name, password } = payload;
    if (!email) throw new Error('Email is required!');
    const { rowCount } = await this.db.query<IUser>(
      'SELECT email FROM users WHERE users.email = $1',
      [email]
    );
    if (rowCount && rowCount > 0) throw new Error('This email belongs to a registered user.');

    const passworrd_hash = await bcrypt.hash(password, 10);

    const { rows } = await this.db.query(
      'INSERT INTO users (first_name, last_name, email, password) VALUES($1, $2, $3, $4)   RETURNING id, first_name, email',
      [first_name, last_name, email, passworrd_hash]
    );

    return rows[0];
  }
}
