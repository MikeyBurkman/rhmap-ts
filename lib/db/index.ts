
import * as env from 'env-var';
import {Db, db as dbCons, Id} from './db';
import { MongoClient, Collection } from 'mongodb';

const mongoUrl = env('FH_MONGODB_CONN_URL', 'mongodb://localhost:27017/FH_LOCAL').asString();

const dbInstance = dbCons(mongoUrl, MongoClient);

export {
    Db,
    Id,
    dbInstance as db
};