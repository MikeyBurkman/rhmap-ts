
import * as Bluebird from 'bluebird';
import * as bodyParser from 'body-parser';
import { Router } from 'express';
import { Id } from 'lib/contracts/db';
import { Dao, Message } from 'lib/contracts/messages';

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

    function groupById(messages: Array<Message & Id>): { [id: string]: Message } {
        const res: { [id: string]: Message } = {};
        messages.forEach((msg) => {
            res[msg._id] = msg;
        });
        return res;
    }
}
