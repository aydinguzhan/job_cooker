import UserController from './user.controler';
import UserService from './user.service';
import UserRepository from './user.repository';
import { db } from '../config/database';

const userRepository = new UserRepository(db);
const userService = new UserService(userRepository);
const userController = new UserController(userService);

export { userController, userService };
