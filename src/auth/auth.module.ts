import AuthController from './auth.controller';
import AuthService from './auth.service';
import AuthRepository from './auth.repository';
import { db } from '../config/database';
import UserRepository from '../user/user.repository';

const authReposiory = new AuthRepository(db);
const userRepository = new UserRepository(db);
const authService = new AuthService(authReposiory, userRepository);
const authController = new AuthController(authService);

export { authController };
