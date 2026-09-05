import { randomInt } from 'node:crypto';
import { Database } from '../config/database';
import { IBaseUser } from '../user/user.entity';
import UserRepository from '../user/user.repository';
import { IAuthRepositry, ILogin, ILoginOr, ILoginResult, IRegister, IUser } from './auth.entity';
import bcrypt from 'bcrypt';

export default class AuthRepository implements IAuthRepositry {
  constructor(
    private readonly db: Database,
    private readonly userRepository: UserRepository
  ) { }
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

  // 1. KOD OLUŞTURMA (Masaüstü Ekranı Çağırır)
  async createLoginCode(userId?: string) {
    const code = randomInt(1000, 10000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 Dakika

    const query = `
      INSERT INTO qr_login_sessions (user_id, session_code, pin_code, expires_at, used_At) 
      VALUES ($1, $2, $3, $4, NOW())
    `;

    // userId isteğe bağlıdır (null geçilebilir, telefon onaylayınca dolacak)
    await this.db.query(query, [userId || null, code, code, expiresAt]);

    return code;
  }

  // 2. KOD ONAYLAMA (Mobil Cihaz Çağırır)
  async approveQrLogin(userId: string, code: string) {
    // Kodu kontrol et: var mı, süresi dolmuş mu, önceden kullanılmış mı?
    const checkQuery = `
      SELECT id FROM qr_login_sessions 
      WHERE pin_code = $1 AND expires_at > NOW() AND used_at = NOW()
    `;
    const session = await this.db.query(checkQuery, [code]);

    if (!session.rowCount) {
      throw new Error('Geçersiz veya süresi dolmuş QR kod.');
    }

    // Oturumu onaylanmış yap ve onaylayan kullanıcının ID'sini kaydet
    const updateQuery = `
      UPDATE qr_login_sessions 
      SET used_at = NOW(), user_id = $1 
      WHERE pin_code = $2
    `;
    await this.db.query(updateQuery, [userId, code]);

    return { success: true, message: 'Giriş onaylandı.' };
  }

  // 3. POLLING/DURUM KONTROLÜ (Masaüstü Ekranı Sorgular)
  async checkLoginCode(code: string) {
    const query = `
      SELECT q.used_at, q.expires_at, u.id as user_id, u.email, u.role_id 
      FROM qr_login_sessions q
      LEFT JOIN users u ON u.id = q.user_id
      WHERE q.pin_code = $1
      ORDER BY q.created_at DESC
      LIMIT 1
    `;
    const result = await this.db.query(query, [code]);

    // Kayıt yoksa veya süresi dolmuşsa
    if (!result.rowCount || new Date(result.rows[0].expires_at) < new Date()) {
      return { status: 'EXPIRED' };
    }

    const session = result.rows[0];

    // Mobil cihaz henüz onaylamadıysa
    if (!session.used_at) {
      return { status: 'PENDING' };
    }

    // Mobil cihaz onayladıysa kullanıcı bilgilerini dön
    return {
      status: 'SUCCESS',
      user: {
        id: session.user_id,
        email: session.email,
        role: session.role_id,
      },
    };
  }
}
