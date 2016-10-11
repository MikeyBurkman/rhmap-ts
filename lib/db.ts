
import * as Promise from 'bluebird';
import {MongoClient} from 'mongodb';

const mongoUrl = process.env['FH_MONGODB_CONN_URL'] || 'mongodb://localhost:27017/FH_LOCAL';

const dbPromise = MongoClient.connect(mongoUrl);

type collections = 'messages';

export function collection(collectionName: collections) {
    return Promise.resolve(dbPromise)
        .then(db => db.collection(collectionName));
}
