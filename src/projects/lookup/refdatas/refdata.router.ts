import express from 'express';
import { refDataController } from './refdata.module';

const refDataRouter = express.Router();

// refdatas

refDataRouter.get('/skills', refDataController.getSkills.bind(refDataController));
refDataRouter.get('/skills-search', refDataController.getSearchSkills.bind(refDataController))

export default refDataRouter;
