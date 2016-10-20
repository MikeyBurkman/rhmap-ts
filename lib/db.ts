
import * as Promise from 'bluebird';
import { MongoClient, Collection } from 'mongodb';

const mongoUrl = process.env['FH_MONGODB_CONN_URL'] || 'mongodb://localhost:27017/FH_LOCAL';

const dbPromise = MongoClient.connect(mongoUrl);

export interface Id {
    _id: string;
}

export type collections = 'messages' | 'pushNotificationTickets';

export function collection(collectionName: collections): Promise<Collection> {
    return Promise.resolve(dbPromise)
        .then(db => db.collection(collectionName));
}
