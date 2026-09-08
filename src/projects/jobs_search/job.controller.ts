import { Request, Response } from "express";
import { errorResponse, successResponse } from "../../utils/response";
import { JobService } from "./job.service";
import { jwtttoUserId } from "../../utils/jwt";
import { IJob } from "./job.entitiy";

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
        const payload: IJob = req.body;
        const userId = jwtttoUserId(req);
        payload.advertiser_id = userId
        const result = await this.jobService.jobCreate(payload);
        return successResponse(res, result)
    }
    async jobFilterNameAndCompany(req: Request, res: Response) {
        const { search, size } = req.query;
        if (!search) return errorResponse(res, "Not Found", 404)
        const result = await this.jobService.jobFilterNameAndCompany(search as string, size as string)
        return successResponse(res, result)
    }



}