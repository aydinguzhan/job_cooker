import { NextFunction, Request, Response } from 'express';
import ProfileService from './profile.service';
import { CreateProfilePayload } from './profile.entity';
import { successResponse } from '../../utils/response';
import { jwtttoUserId } from '../../utils/jwt';

export default class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  async getProfileByUserId(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = jwtttoUserId(req);
      console.log('---->', userId);
      const result = await this.profileService.getProfileByUserId(userId as string);
      return res.send({ data: result });
    } catch (error) {
      next(error);
    }
  }
  async createUserProfile(req: Request, res: Response) {
    const payload = req.body;
    const result = await this.profileService.createUserProfile(payload as CreateProfilePayload);
    return successResponse(res, result);
  }

  async updatedUserInfo(req: Request, res: Response) {
    const userId = jwtttoUserId(req);
    const payload = req.body;
    const updatedUserProfile = await this.profileService.updatedUserInfo({
      user_id: userId,
      ...payload,
    });
    return successResponse(res, updatedUserProfile, 'Profile update succesful', 201);
  }
  async updateProfileSkills(req: Request, res: Response) {
    const user_id = jwtttoUserId(req);
    const payload = req.body;
    const result = await this.profileService.updateProfileSkills({ user_id, ...payload });
    return successResponse(res, result);
  }
  async updateProfileReferences(req: Request, res: Response) {
    const user_id = jwtttoUserId(req);
    const payload = req.body;
    const result = await this.profileService.updateProfileReferences({ user_id, ...payload });
    return successResponse(res, result);
  }
  async updateProfileExperiences(req: Request, res: Response) {
    const user_id = jwtttoUserId(req);
    const payload = req.body;
    const result = await this.profileService.updateProfileExperiences({ user_id, ...payload });
    return successResponse(res, result);
  }
  async postAiGeneratedProfile(req: Request, res: Response) {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({
        message: 'Prompt alanı zorunludur',
      });
    }
    const result = await this.profileService.postAiGeneratedProfile(prompt);
    return successResponse(res, result);
  }
}
