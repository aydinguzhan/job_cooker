import NavigatorRepository from './navigation.repository';

export default class NavigatorService {
  constructor(private readonly navigatorRepository: NavigatorRepository) {}
  async getNavigations(user_id: string) {
    return await this.navigatorRepository.get(user_id);
  }
}
