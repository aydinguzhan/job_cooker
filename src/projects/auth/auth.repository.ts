import { Database } from '../config/database';
import { IBaseUser } from '../user/user.entity';
import UserRepository from '../user/user.repository';
import { IAuthRepositry, ILogin, ILoginResult, IRegister, IUser } from './auth.entity';
import bcrypt from 'bcrypt';

export default class AuthRepository implements IAuthRepositry {
  constructor(
    private readonly db: Database,
    private readonly userRepository: UserRepository
  ) {}
  async login(payload: ILogin): Promise<ILoginResult> {
    const { email } = payload;

    const { rowCount, rows } = await this.db.query(
      'SELECT id,email,password_hash,role_id from users WHERE users.email = $1',
      [email]
    );

    if (!rowCount || rowCount === 0) {
      throw new Error('Registration not found for the user.');
    }
    return rows[0] || null;
  }

  async createLoginCode(userId: string)  {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    const query = `INSERT INTO qr_login_sessions (user_id, session_code, pin_code,expires_at) VALUES($1,$2,$3,$4)`;
    
    const {rows} = await this.db.query(query,[])
    
    return code;
  }
  async register(payload: IRegister): Promise<IBaseUser> {
    const { email, first_name, last_name, password, role } = payload;
    if (!email) throw new Error('Email is required!');
    const { rowCount } = await this.db.query<IUser>(
      'SELECT email FROM users WHERE users.email = $1',
      [email]
    );
    if (rowCount && rowCount > 0) throw new Error('This email belongs to a registered user.');

    const password_hash = await bcrypt.hash(password, 10);
    const result = await this.userRepository.post({
      first_name,
      last_name,
      email,
      password_hash,
      role,
    });

    return result;
  }
}
