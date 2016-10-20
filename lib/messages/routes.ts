
import { Router } from 'express';
import * as bodyParser from 'body-parser';
import * as dao from './dao';

const router = Router();

router.use(bodyParser.json());

router.get('/', (req, res, next) => {
    dao.getAllMessages()
        .then(messages => messages.map(m => m.body))
        .then(bodies => res.json(bodies))
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

export = router;
