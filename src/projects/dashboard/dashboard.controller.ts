import { NextFunction, Request, Response } from "express";
import { DashboardService } from "./dashboard.service";
import { jwtttoUserId } from "../../utils/jwt";
import { successResponse } from "../../utils/response";

export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  async getFeeds(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = jwtttoUserId(req);
      const limit = Number.parseInt(String(req.query.limit ?? "10"), 10) || 10;
      const offset = Number.parseInt(String(req.query.offset ?? "0"), 10) || 0;

      const feeds = await this.dashboardService.getFeeds({ userId, limit, offset });

      return successResponse(res, feeds, "Dashboard feeds fetched successfully");
    } catch (error) {
      next(error);
    }
  }
}
