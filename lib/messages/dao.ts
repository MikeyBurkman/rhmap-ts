
import * as Promise from 'bluebird';
import { Db, Id } from '../contracts/db';
import { Dao, Message } from '../contracts/messages';

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
            body,
            insertDate: new Date()
        };
        return db.insert('messages', message);
    }
}
