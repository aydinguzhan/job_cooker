import { NextFunction, Request, Response } from 'express';
import { IBaseUser, IFilterUser } from './user.entity';
import UserService from './user.service';
import { errorResponse, successResponse } from '../../utils/response';

export default class UserController {
  constructor(private userService: UserService) { }

  async getUser(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      if (typeof id !== 'string') {
        return errorResponse(res, 'Invelid user', 404, 'User not found. ');
      }
      const user = await this.userService.getUser(id);
      return res.send(user);
    } catch (error) {
      next(error);
    }
  }
  async createUser(req: Request, res: Response) {
    const payload = req.body;
    const createUser = await this.userService.createUser(payload);
    return successResponse(res, createUser, 'Successfuly create user', 201);
  }
  async updatedUser(req: Request, res: Response) {
    const payload = req.body;
    const updatedUser = await this.userService.updatedUser(payload);
    return successResponse(res, updatedUser, 'Successfull update user', 200);
  }
  async deleteUser(req: Request, res: Response) {
    const { id } = req.params;
    await this.userService.deleteUser(id as string);
    return successResponse(res, null, 'Successfully deleted user', 204);
  }
  async getUserFilterName(req: Request, res: Response) {
    const { name } = req.query;
    console.log(name)
    const result = await this.userService.getUserFilterName(name as string)
    return successResponse(res, result)
  }
}
