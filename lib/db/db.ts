
import * as Promise from 'bluebird';
import { Collection, MongoClient } from 'mongodb';
import * as DB from '../contracts/db';

export default buildDb;

function buildDb(mongoUrl: string, MClient: typeof MongoClient): DB.Db {

    const dbPromise = MongoClient.connect(mongoUrl);

    return {
        collection,
        find,
        insert
    };

    function collection(collectionName: DB.collections): Promise<Collection> {
        return Promise.resolve(dbPromise)
            .then((db) => db.collection(collectionName));
    }

    function find<T>(collectionName: DB.collections, query?: any): Promise<Array<T & DB.Id>> {
        return collection(collectionName)
            .then((coll) => coll.find(query).toArray());
    }

    function insert<T>(collectionName: DB.collections, record: T): Promise<(T & DB.Id)> {
        return collection(collectionName)
            .then((coll) => coll.insert(record))
            .then((res) => res.ops[0]);
    }

}
