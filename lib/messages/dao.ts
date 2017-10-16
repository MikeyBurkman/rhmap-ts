
import * as Promise from 'bluebird';
import { Message, Dao } from '../contracts/messages';
import { Db, Id } from '../contracts/db';

export default dao;

function dao(db: Db): Dao {
    return {
        getAllMessages,
        insertMessage
    };

    function getAllMessages() {
        return db.find<Message>('messages');
    }

    function insertMessage(body: any) {
        const message: Message = {
            body: body,
            insertDate: new Date()
        };
        return db.insert('messages', message);
    }
}
