import { JobController } from "./job.controller";
import { JobService } from "./job.service";
import { JobRepository } from "./job.repository";
import { db } from '../config/database';


const jobRepository = new JobRepository(db)
const jobService = new JobService(jobRepository);
const jobController = new JobController(jobService);

export { jobController }