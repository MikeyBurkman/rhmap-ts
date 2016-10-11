
import {Router} from 'express';
import {Message} from './types';
import * as bodyParser from 'body-parser';
import * as dao from './dao';

const router = Router();
export default router;

router.use(bodyParser.json());

router.get('/', (req, res, next) => {
  dao.getAllMessages()
    .then(messages => res.json(messages.map(m => m.body)))
    .catch(next);
});

router.put('/', (req, res, next) => {
    if (!req.body.message) {
        return next(new Error('Must provide a request body with a `message` property'));
    }
    dao.insertMessage(req.body.message)
        .then(() => res.sendStatus(201))
        .catch(next);
});