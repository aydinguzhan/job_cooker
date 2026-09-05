import { NextFunction, Request, Response } from 'express';
import AuthService from './auth.service';
import { errorResponse, successResponse } from '../../utils/response';

export default class AuthController {
  constructor(private authService: AuthService) { }

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
  // 1. MASAÜSTÜ: QR Kod Oluşturma
  async createLoginCode(req: Request, res: Response, next: NextFunction) {
    try {
      // req.user üzerinden id veya sub alanını esnek biçimde alıyoruz
      const userId = req.user?.id || req.user?.sub;

      if (!userId) {
        return errorResponse(res, "Yetkisiz erişim", 401, "Kullanıcı doğrulanamadı");
      }

      const code = await this.authService.createLoginCode(userId);
      return successResponse(res, code, "QR kod başarıyla oluşturuldu");
    } catch (error) {
      next(error);
    }
  }

  // 2. MASAÜSTÜ (Polling): QR Durum Sorgulama (Public / Middleware'siz)
  async checkLoginCode(req: Request, res: Response, next: NextFunction) {
    try {
      // URL Query'den kodu okuyoruz: /auth/qr-status?code=1234
      const code = req.query.code as string;
      console.log("code", code)

      if (!code) {
        return errorResponse(res, "QR Kod (code) parametresi zorunludur", 400);
      }

      const result = await this.authService.checkLoginCode(code);
      return successResponse(res, result);
    } catch (error) {
      next(error);
    }
  }

  // 3. MOBİL: QR Kod Onaylama (Korumalı / Auth Middleware'li)
  async approveQrLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id || req.user?.sub;

      if (!userId) {
        return errorResponse(res, "Yetkisiz erişim", 401);
      }

      const { code } = req.body;
      if (!code) {
        return errorResponse(res, "QR Kod (code) alanı zorunludur", 400);
      }

      const result = await this.authService.approveQrLogin(userId, code);
      return successResponse(res, result, "Giriş başarıyla onaylandı.");
    } catch (error) {
      next(error);
    }
  }
}