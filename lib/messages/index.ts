
import db from 'lib/db';
import messageDao from './dao';
import buildRouter from './routes';

const daoInstance = messageDao(db);

const routerInstance = buildRouter(daoInstance);

export default routerInstance;
