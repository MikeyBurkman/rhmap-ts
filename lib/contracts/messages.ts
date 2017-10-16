
import * as Promise from 'bluebird';
import {Id} from './db';

export interface Message {
  readonly insertDate: Date,
  readonly body: any;
}

export interface Dao {
  getAllMessages: () => Promise<(Message & Id)[]>;
  insertMessage: (body: any) => Promise<Message & Id>;
}