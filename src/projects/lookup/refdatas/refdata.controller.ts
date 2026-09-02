import { successResponse } from '../../../utils/response';
import RefdataService from './redata.service';
import { Request, Response } from 'express';
export default class RefdataController {
  constructor(private readonly refdataService: RefdataService) { }
  async getSkills(req: Request, res: Response) {
    const refDatas = await this.refdataService.getSkills();
    return successResponse(res, refDatas, 'Succesfuly', 200);
  }
  async getSearchSkills(req: Request, res: Response) {
    const { query } = req;
    const refDatas = await this.refdataService.getSearchSkills(query.skill as string);
    return successResponse(res, refDatas, 'Succesfuly', 200);
  }
}
