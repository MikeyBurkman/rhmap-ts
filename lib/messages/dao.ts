
import * as Promise from 'bluebird';
import { IMessage } from './types';
import {Db, Id} from '../db';

export {
    Dao,
    dao
}

interface Dao {
    getAllMessages: () => Promise<(IMessage&Id)[]>;
    insertMessage: (body: any) => Promise<IMessage&Id>;
}

function dao(db: Db): Dao {
    return {
        getAllMessages,
        insertMessage
    };

    function getAllMessages() {
        return db.find<IMessage>('messages');
    }
    
    function insertMessage(body: any) {
        const message: IMessage = {
            body: body,
            insertDate: new Date()
        };
        return db.insert('messages', message);
    }
}
