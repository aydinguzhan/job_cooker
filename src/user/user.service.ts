import { IBaseUser, IWithPassword } from './user.entity';
import UserRepository from './user.repository';

export default class UserService {
  constructor(private userRepository: UserRepository) {}
  async getUser(userId:string) {
    return await this.userRepository.get(userId);
  }
  async createUser(payload: IBaseUser & IWithPassword) {
    return this.userRepository.post(payload);
  }
  async updatedUser(payload: IBaseUser) {
    return await this.userRepository.put(payload);
  }
  async deleteUser(id: string) {
    return await this.userRepository.delete(id);
  }
}
