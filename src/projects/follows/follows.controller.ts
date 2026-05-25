import { NextFunction, Request, Response } from "express";
import FollowsService from "./follows.service";
import { successResponse } from "../../utils/response";
import { jwtttoUserId } from "../../utils/jwt";

export default class FollowsController {
  constructor(private readonly followsService: FollowsService) {}

  async follow(req: Request, res: Response, next: NextFunction) {
    try {
      const followerId = jwtttoUserId(req);
      const { followingId } = req.params;

      const result = await this.followsService.follow(
        followerId,
        followingId as string
      );

      return successResponse(res, result, "Followed successfully", 201);
    } catch (error) {
      next(error);
    }
  }

  async unfollow(req: Request, res: Response, next: NextFunction) {
    try {
      const followerId = jwtttoUserId(req);
      const { followingId } = req.params;

      const result = await this.followsService.unfollow(
        followerId,
        followingId as string
      );

      return successResponse(res, result, "Unfollowed successfully");
    } catch (error) {
      next(error);
    }
  }

  async getFollowers(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = jwtttoUserId(req);

      const followers = await this.followsService.getFollowers(userId);

      return successResponse(
        res,
        followers,
        "Followers retrieved successfully"
      );
    } catch (error) {
      next(error);
    }
  }

  async getFollowings(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = jwtttoUserId(req);

      const followings = await this.followsService.getFollowings(userId);

      return successResponse(
        res,
        followings,
        "Followings retrieved successfully"
      );
    } catch (error) {
      next(error);
    }
  }

  async getSuggestions(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = jwtttoUserId(req);

      const suggestions = await this.followsService.getSuggestions(userId);

      return successResponse(
        res,
        suggestions,
        "Suggestions retrieved successfully"
      );
    } catch (error) {
      next(error);
    }
  }
}