
import * as db from 'db';
import {Message} from './types';

export function getAllMessages(): Promise<Message[]> {
    return db.collection('messages')
        .then(coll => coll.find().toArray());
}

export function insertMessage(body: any): Promise<any> {
    const message: Message = {
        insertDate: new Date(),
        body: body
    };
    return db.collection('messages')
        .then(coll => coll.insert(message));
}