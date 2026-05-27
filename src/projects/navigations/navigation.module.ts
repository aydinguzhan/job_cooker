import NavigatorRepository from "./navigation.repository";
import NavigatorService from "./navigation.service";
import NavigatorController from "./navigation.controller";
import { db } from '../config/database';

const navigationRepository = new NavigatorRepository(db);
const navigationService = new NavigatorService(navigationRepository);
const navigationController = new NavigatorController(navigationService);

export {navigationController}