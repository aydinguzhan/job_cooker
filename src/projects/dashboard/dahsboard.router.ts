import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middeware';
import { dashboardController } from './dashboard.module';

const dashboardRouter = Router();

dashboardRouter.get('/', authMiddleware, dashboardController.getFeeds.bind(dashboardController));

export default dashboardRouter;
