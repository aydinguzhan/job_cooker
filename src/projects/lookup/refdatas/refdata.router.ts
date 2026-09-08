import express from 'express';
import { refDataController } from './refdata.module';

const refDataRouter = express.Router();

// refdatas /refdatas/companies-search?company

refDataRouter.get('/skills', refDataController.getSkills.bind(refDataController));
refDataRouter.get('/skills-search', refDataController.getSearchSkills.bind(refDataController));
refDataRouter.get('/companies-search', refDataController.getSearchCompaniy.bind(refDataController));

export default refDataRouter;
