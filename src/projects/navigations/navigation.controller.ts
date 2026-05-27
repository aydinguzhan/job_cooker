import { Request, Response } from 'express';
import NavigatorService from './navigation.service';
import { successResponse } from '../../utils/response';

export default class NavigatorController {
  constructor(private readonly navigatorService: NavigatorService) {}

  async getNavigations(req: Request, res: Response) {
    const { userId } = req.params;
    console.log("params",userId)
    try {
      const results = await this.navigatorService.getNavigations(userId as string);
      return successResponse(res, results);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}
