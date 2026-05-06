import express from 'express';
import { authController } from './auth.module';
const router = express.Router();

// --> /auth
router.post('/login', authController.login.bind(authController));
router.post('/register', authController.register.bind(authController));


export default router