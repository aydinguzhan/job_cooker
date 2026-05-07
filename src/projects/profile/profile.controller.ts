import { Request, Response } from 'express';
import ProfileService from './profile.service';
import { ProfileEntity } from './profile.entity';
import { successResponse } from '../../utils/response';

export default class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  async getUserIdForProfile(req: Request, res: Response) {
    const { userId } = req.params;
    const result = await this.profileService.getUserIdForProfile(userId as string);
    return res.send({ data: result });
  }
  async createUserProfile(req: Request, res: Response) {
    const payload = req.body;

    return res.send(
      this.profileService.createUserProfile(payload as ProfileEntity)
    );
  }

  async updatedProfileWithuserId(req: Request, res: Response) {
    const { userId } = req.params;
    const payload = req.body;
    const updatedUserProfile = await this.profileService.updatedProfileWithuserId(
      userId as string,
      payload
    );
    return (successResponse(res,updatedUserProfile,"Profile update succesful",201));
  }
}
