import { z } from "zod";

export const searchJobsQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    size: z.coerce.number().int().min(1).max(100).default(10),
    keyword: z.string().trim().max(120).default(""),
});
