import UserRepository from '../user/user.repository';
import { singAccessToken } from '../../utils/jwt';
import { ILogin, IRegister, ITokenResponse } from './auth.entity';
import AuthRepository from './auth.repository';
import bcrypt from 'bcrypt';

export default class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly userRepository: UserRepository
  ) {}

  async login(payload: ILogin): Promise<ITokenResponse> {
    const { email, password } = payload;
    const user = await this.authRepository.login(payload);
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) throw new Error('Invalid emmail or password!');

    const userInfo = await this.userRepository.getUserForEmail(email);
    const accessToken = singAccessToken({
      sub: userInfo.id,
      email: userInfo.email,
      role: userInfo.role_id,
    });

    return {
      accessToken,
      user: {
        id: userInfo.id,
        email: userInfo.email,
        first_name: userInfo.first_name,
        last_name: userInfo.last_name,
      },
    };
  }
  async register(payload: IRegister) {
    return await this.authRepository.register(payload);
  }
  async createLoginCode(userId:string){
    return await this.authRepository.createLoginCode(userId)
  }
}
