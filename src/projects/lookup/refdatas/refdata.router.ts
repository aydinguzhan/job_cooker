import express from 'express';
import { refDataController } from './refdata.module';

const refDataRouter = express.Router();

// refdatas

refDataRouter.get('/skills', refDataController.getSkills.bind(refDataController));

export default refDataRouter