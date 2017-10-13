
import {dao} from './dao';
import {db} from '../db';
import {buildRouter} from './routes';

const daoInstance = dao(db);

const routerInstance = buildRouter(daoInstance);

export default routerInstance;