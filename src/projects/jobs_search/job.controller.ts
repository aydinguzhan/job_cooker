import { Request, Response } from "express";
import { errorResponse, successResponse } from "../../utils/response";
import { JobService } from "./job.service";
import { jwtttoUserId } from "../../utils/jwt";
import { IJob } from "./job.entitiy";
import { z } from "zod";
import { searchJobsQuerySchema } from "./job.schema";

const scrapedJobsSchema = z.array(
    z.object({
        title: z.string().trim().min(1).max(100),
        suitability_rate: z.number().int().min(1).max(5).optional(),
        description: z.string().optional(),
        url: z.string().url().max(150),
    }),
).min(1).max(100);

export class JobController {
    constructor(private readonly jobService: JobService) { };

    async searchJob(req: Request, res: Response) {
        const parsedQuery = searchJobsQuerySchema.safeParse(req.query);
        if (!parsedQuery.success) {
            return errorResponse(res, "Invalid job search parameters", 400);
        }

        const { page, size, keyword } = parsedQuery.data;
        const results = await this.jobService.searchJob(
            String(page),
            String(size),
            keyword,
        );
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
    async jobBulkCreate(req: Request, res: Response) {
        const payload = scrapedJobsSchema.parse(req.body);
        const result = await this.jobService.jobBulkCreate(payload)
        return successResponse(res, result)
    }



}
