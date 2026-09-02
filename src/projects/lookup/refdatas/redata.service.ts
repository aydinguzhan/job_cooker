import RefdataRepository from './refdata.repostiory';

export default class RefdataService {
  constructor(private readonly refdataRepository: RefdataRepository) { }
  async getSkills() {
    return await this.refdataRepository.getSkills();
  }
  async getSearchSkills(query: string) {
    return await this.refdataRepository.getSearchSkills(query);
  }
}
