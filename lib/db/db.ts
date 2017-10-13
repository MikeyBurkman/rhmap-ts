
import * as Promise from 'bluebird';
import { MongoClient, Collection } from 'mongodb';

export {
    Db,
    Id,
    db
};

interface Id {
    _id: string;
}

type collections = 'messages' | 'pushNotificationTickets';

interface Db {
    collection: (collectionName: collections) => Promise<Collection>;
    find: <T>(collectionName: collections, query?: any) => Promise<(T&Id)[]>;
    insert: <T>(collectionName: collections, record: T) => Promise<(T&Id)>;
}

function db(mongoUrl: string, MClient: typeof MongoClient): Db {
    
    const dbPromise = MongoClient.connect(mongoUrl);

    return {
        collection,
        find,
        insert
    };

    function collection(collectionName: collections): Promise<Collection> {
        return Promise.resolve(dbPromise)
            .then(db => db.collection(collectionName));
    }
    
    function find<T>(collectionName: collections, query?: any): Promise<(T&Id)[]> {
        return collection(collectionName)
            .then(coll => coll.find(query).toArray());
    }
    
    function insert<T>(collectionName: collections, record: T): Promise<(T&Id)> {
        return collection(collectionName)
            .then(coll => coll.insert(record))
            .then(res => res.ops[0])
    }
    
}