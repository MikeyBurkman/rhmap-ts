
import {collection, Id} from 'lib/db';
import * as Promise from 'bluebird';
import { IMessage } from './types';

export function getAllMessages(): Promise<(IMessage&Id)[]> {
    return collection('messages')
        .then(coll => coll.find().toArray());
}

export function insertMessage(body: any): Promise<any> {
    const message: IMessage = {
        body: body,
        insertDate: new Date()
    };
    return collection('messages')
        .then(coll => coll.insert(message));
}
