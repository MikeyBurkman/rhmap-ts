
import * as Promise from 'bluebird';
import { Collection } from 'mongodb';

export {
    Db,
    Id,
    collections
};

interface Id {
    readonly _id: string;
}

type collections = 'messages' | 'pushNotificationTickets';

interface Db {
    collection: (collectionName: collections) => Promise<Collection>;
    find: <T>(collectionName: collections, query?: any) => Promise<(T & Id)[]>;
    insert: <T>(collectionName: collections, record: T) => Promise<(T & Id)>;
}