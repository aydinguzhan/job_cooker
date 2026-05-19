import AuthController from './auth.controller';
import AuthService from './auth.service';
import AuthRepository from './auth.repository';
import { db } from '../config/database';
import UserRepository from '../user/user.repository';

const userRepository = new UserRepository(db);
const authReposiory = new AuthRepository(db, userRepository);
const authService = new AuthService(authReposiory, userRepository);
const authController = new AuthController(authService);

export { authController };
