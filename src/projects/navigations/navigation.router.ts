import express from 'express';
import { navigationController } from './navigation.module';
import { authMiddleware } from '../../middleware/auth.middeware';

const navigationRouter = express.Router();

//--> /navigation

navigationRouter.get(
  '/:userId',
  authMiddleware,
  navigationController.getNavigations.bind(navigationController)
);

export default navigationRouter;
