
import * as Bluebird from 'bluebird';
import { Message } from '../contracts/messages';
import { Router } from 'express';
import * as bodyParser from 'body-parser';
import { Dao } from '../contracts/messages';
import { Id } from '../contracts/db';

export default buildRouter;

function buildRouter(dao: Dao): Router {
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

    return router;

    function groupById(messages: (Message & Id)[]): { [id: string]: Message } {
        return messages.reduce((acc, msg) => {
            acc[msg._id] = msg.body;
            return acc;
        }, {});
    }
}

