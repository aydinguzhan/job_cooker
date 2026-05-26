import FollowsService from './follows.service';
import FollowsRepository from './follows.repository';
import { db } from '../config/database';
import FollowsController from './follows.controller';

const followsRepository = new FollowsRepository(db);
const followsService = new FollowsService(followsRepository);
const followsController = new FollowsController(followsService);

export { followsController,followsService };
