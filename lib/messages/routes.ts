import {IMessage} from './types';
import { Router } from 'express';
import * as bodyParser from 'body-parser';
import * as dao from './dao';
import {Id} from '../db';

const router = Router();

router.use(bodyParser.json());

router.get('/', async (req, res, next) => {
    try {
        const messages = await dao.getAllMessages();
        const grouped = groupById(messages);
        res.json(grouped);
    } catch (err) {
        next(err);
    }
});

router.put('/', async (req, res, next) => {
    if (!req.body.message) {
        return next(new Error('Must provide a request body with a `message` property'));
    }

    try {
        await dao.insertMessage(req.body.message);
        res.sendStatus(201);
    } catch (err) {
        next(err);
    }
});

function groupById(messages: (IMessage&Id)[]): {[id: string]: IMessage} {
    return messages.reduce((acc, msg) => {
        acc[msg._id] = msg.body;
        return acc;
    }, {});
}

export = router;
