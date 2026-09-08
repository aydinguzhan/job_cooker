import { IJob } from "./job.entitiy";
import { JobRepository } from "./job.repository";

export class JobService {
    constructor(private readonly jobRepository: JobRepository) { }

    async searchJob(page: string, size: string) {
        return await this.jobRepository.searchJob(page, size)
    }
    async jobDetail(jobId: string) {
        return await this.jobRepository.jobDetail(jobId)
    }
    async jobCreate(payload: IJob) {
        return await this.jobRepository.jobCreate(payload)
    }
    async jobFilterNameAndCompany(searchKey: string, size: string) {
        return await this.jobRepository.jobFilterNameAndCompany(searchKey, size)
    }
}