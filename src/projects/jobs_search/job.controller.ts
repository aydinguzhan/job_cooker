import { Request, Response } from "express";
import { successResponse } from "../../utils/response";
import { JobService } from "./job.service";

export class JobController {
    constructor(private readonly jobService: JobService) { };

    async searchJob(req: Request, res: Response) {
        const { page, size } = req.query
        const results = await this.jobService.searchJob(page as string, size as string)
        return successResponse(res, results)
    }

    async jobDetail(req: Request, res: Response) {
        const { jobId } = req.params
        const results = await this.jobService.jobDetail(jobId as string);
        return successResponse(res, results)
    }

    async jobCreate(req: Request, res: Response) {
        const payload = req.body;
        const result = await this.jobService.jobCreate(payload);
        return successResponse(res, result)
    }



}