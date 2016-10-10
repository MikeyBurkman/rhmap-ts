
import {Router} from 'express';
import * as db from './db';

export interface Message {
  readonly insertDate: Date,
  readonly body: any;
}

export const router = Router();

router.get('/messages', (req, res, next) => {
  db.collection('messages')
    .then(coll => coll.find().toArray())
    .then((messages: Message[]) => res.json(messages.map(m => m.body)))
    .catch(next);
});

router.put('/messages', (req, res, next) => {
  const message: Message = {
    insertDate: new Date(),
    body: req.body
  };
  db.collection('messages')
    .then(coll => coll.insert(message))
    .then(() => res.json(201))
    .catch(next);
});