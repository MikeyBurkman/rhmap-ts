
import * as env from 'env-var';
import buildDb from './db';
import { MongoClient, Collection } from 'mongodb';

const mongoUrl = env('FH_MONGODB_CONN_URL', 'mongodb://localhost:27017/FH_LOCAL').asString();

const dbInstance = buildDb(mongoUrl, MongoClient);

export default dbInstance;