
import * as Promise from 'bluebird';
import { Id } from 'lib/contracts/db';

export interface Message {
  readonly insertDate: Date;
  readonly body: any;
}

export interface Dao {
  getAllMessages: () => Promise<Array<Message & Id>>;
  insertMessage: (body: any) => Promise<Message & Id>;
}
