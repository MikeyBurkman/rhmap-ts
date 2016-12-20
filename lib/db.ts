
import * as Promise from 'bluebird';
import { MongoClient, Collection } from 'mongodb';
import * as env from 'env-var';

const mongoUrl = env('FH_MONGODB_CONN_URL', 'mongodb://localhost:27017/FH_LOCAL').asString();

const dbPromise = MongoClient.connect(mongoUrl);

export interface Id {
    _id: string;
}

export type collections = 'messages' | 'pushNotificationTickets';

export function collection(collectionName: collections): Promise<Collection> {
    return Promise.resolve(dbPromise)
        .then(db => db.collection(collectionName));
}

export function find<T>(collectionName: collections, query?: any): Promise<(T&Id)[]> {
    return collection(collectionName)
        .then(coll => coll.find(query).toArray());
}

export function insert<T>(collectionName: collections, record: T): Promise<any> {
    return collection(collectionName)
        .then(coll => coll.insert(record));
}
