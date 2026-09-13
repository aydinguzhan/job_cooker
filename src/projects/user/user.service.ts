import { IBaseUser, IFilterUser } from './user.entity';
import UserRepository from './user.repository';

export default class UserService {
  constructor(private userRepository: UserRepository) { }
  async getUser(userId: string) {
    return await this.userRepository.get(userId);
  }
  async createUser(payload: IBaseUser & { password_hash: string }) {
    return this.userRepository.post(payload);
  }
  async updatedUser(payload: IBaseUser) {
    return await this.userRepository.put(payload);
  }
  async deleteUser(id: string) {
    return await this.userRepository.delete(id);
  }
  async getUserFilterName(name: string): Promise<IFilterUser[]> {
    return await this.userRepository.getUserFilterName(name)
  }
}
