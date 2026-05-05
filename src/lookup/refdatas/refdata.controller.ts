import { successResponse } from '../../utils/response';
import  RefdataService  from './redata.service';
import { Request,Response } from 'express';
export default class RefdataController {
  constructor(private readonly refdataService: RefdataService) {}
  async getSkills(req:Request, res:Response) {
    const refDatas = await this.refdataService.getSkills()
    return successResponse(res,refDatas,"Succesfuly",200);
  }
}
