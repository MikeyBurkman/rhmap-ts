
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
    .map((value: Message) => value.body)
    .then(values => res.json(values))
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