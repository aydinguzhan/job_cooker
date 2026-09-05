import express from 'express';
import { authController } from './auth.module';
import { authMiddleware } from '../../middleware/auth.middeware';
const router = express.Router();

// --> /auth
router.post('/login', authController.login.bind(authController));
router.post('/register', authController.register.bind(authController));
router.get('/login-qr', authMiddleware, authController.createLoginCode.bind(authController));
router.get('/qr-status', authController.checkLoginCode.bind(authController));
router.post('/qr-approve', authMiddleware, authController.approveQrLogin.bind(authController));
export default router;
