import { NextFunction, Request, Response } from 'express';
import AuthService from './auth.service';
import { errorResponse, successResponse } from '../../utils/response';
import { jwtttoUserId } from '../../utils/jwt';

export default class AuthController {
  constructor(private authService: AuthService) {}

  async register(req: Request, res: Response, next: NextFunction) {
    const { first_name, last_name, password, email, role } = req.body;
    if (!(first_name && last_name && password && email)) {
      res.status(400).send({ message: 'Incomplete information!' });
    }

    try {
      const newUser = await this.authService.register({
        first_name,
        last_name,
        email,
        password,
        role,
      });
      return successResponse(res, newUser, 'Register successful', 201);
    } catch (error) {
      next(error);
    }
  }
  async login(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;

    try {
      const result = await this.authService.login({ email, password });
      return successResponse(res, result, 'Login successful');
    } catch (error) {
      next(error);
    }
  }
  async createLoginCode(req: Request, res: Response) {
    const code = await this.authService.createLoginCode("deneme");
    successResponse(res, code);
  }
}
