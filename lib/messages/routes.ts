import {IMessage} from './types';
import { Router } from 'express';
import * as bodyParser from 'body-parser';
import * as dao from './dao';
import {Id} from 'lib/db';

const router = Router();

router.use(bodyParser.json());

router.get('/', (req, res, next) => {
    dao.getAllMessages()
        .then(groupById)
        .then(messagesObj => res.json(messagesObj))
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

function groupById(messages: (IMessage&Id)[]) {
    return messages.reduce((acc, msg) => {
        acc[msg._id] = msg.body;
        return acc;
    }, {});
}

export = router;
