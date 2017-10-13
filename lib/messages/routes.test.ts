
import 'mocha';
import * as express from 'express';
import * as sinon from 'sinon';
import * as request from 'supertest';
import {Dao} from './dao';
import {buildRouter} from './routes';
import { Router } from 'express';
import { expect } from 'chai';

describe(__filename, () => {

    let sut: Router;
    let app: express.Express;
    let dao: Dao;

    beforeEach(() => {
        app = express();

        dao = {
            getAllMessages: sinon.stub(),
            insertMessage: sinon.stub()
        };

        sut = buildRouter(dao);

        app.use('/messages', sut);
    });

    it('Should get all messages from the dao', (done) => {

        const mockMessages = [{
            _id: '1',
            body: 'foo'
        }, {
            _id: '2',
            body: 'bar'
        }];
        //dao.getAllMessages.returns(Promise.resolve(mockMessages));

        request(app)
            .get('/messages')
            .expect((res: any) => {
                expect(res.body).to.eql({
                    1: 'foo',
                    2: 'bar'
                });
            })
            .expect(200, done);
    });

    it('Should insert a record into the dao', (done) => {
        //dao.insertMessage.returns(Promise.resolve());

        request(app)
            .put('/messages')
            .set('Content-Type', 'application/json')
            .send({ message: 'fooMessage' })
            .expect(() => {
                //expect(dao.insertMessage.callCount).to.eql(1);
                //const arg = dao.insertMessage.getCall(0).args[0];
                //expect(arg).to.eql('fooMessage');
            })
            .expect(201, done);
    });

    it('Should get an error on malformed request', (done) => {
        request(app)
            .put('/messages')
            .set('Content-Type', 'application/json')
            .send({ nope: true })
            .expect(500, done);
    });
});
