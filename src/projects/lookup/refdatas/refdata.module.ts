import RefdataController from './refdata.controller';
import RefdataService from './redata.service';
import RefdataRepository from './refdata.repostiory';
import { db } from '../../config/database';

const refDataRepository = new RefdataRepository(db);
const refdataService = new RefdataService(refDataRepository);
const refDataController = new RefdataController(refdataService);

export { refDataController };
