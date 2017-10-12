
import * as db from '../db';
import * as Promise from 'bluebird';
import { IMessage } from './types';

export function getAllMessages() {
    return db.find<IMessage>('messages');
}

export function insertMessage(body: any): Promise<any> {
    const message: IMessage = {
        body: body,
        insertDate: new Date()
    };
    return db.insert('messages', message);
}
