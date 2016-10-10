
import {Router} from 'express';
import {Message} from './types';
import * as dao from './dao';

const router = Router();
export default router;

router.get('/', (req, res, next) => {
  dao.getAllMessages()
    .then(messages => res.json(messages.map(m => m.body)))
    .catch(next);
});

router.put('/', (req, res, next) => {
    dao.insertMessage(req.body)
        .then(() => res.json(201))
        .catch(next);
});