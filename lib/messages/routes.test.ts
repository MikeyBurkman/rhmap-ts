
import 'jest';
import * as Promise from 'bluebird';
import * as express from 'express';
import * as request from 'supertest-as-promised';
import { Router } from 'express';
import { Dao } from '../contracts/messages';
import buildRouter from './routes';
import { Stubbed } from '../testUtil'

let sut: Router;
let app: express.Express;
let dao: Stubbed<Dao>;

beforeEach(() => {
    app = express();

    dao = {
        getAllMessages: jest.fn(),
        insertMessage: jest.fn()
    };

    sut = buildRouter(dao);

    app.use('/', sut);
});

describe('#GET /', () => {
    it('Should get all messages from the dao', () => {

        const mockMessages = [{
            _id: '1',
            body: 'foo'
        }, {
            _id: '2',
            body: 'bar'
        }];
        dao.getAllMessages.mockReturnValue(Promise.resolve(mockMessages));

        return request(app)
            .get('/')
            .expect((res: any) => {
                expect(res.body).toEqual({
                    1: 'foo',
                    2: 'bar'
                });
            })
            .expect(200);
    });

    test('Should get an error if the dao throws one', () => {
        dao.getAllMessages.mockReturnValue(Promise.reject(new Error('Oh noes')));
    
        return request(app)
            .get('/')
            .expect(500)
            .expect((res: any) => {
                expect(res.error.text).toContain('Oh noes');
            });
    });
});

describe('#PUT /', () => {
    test('Should insert a record into the dao', () => {
        dao.insertMessage.mockReturnValue(Promise.resolve());

        return request(app)
            .put('/')
            .set('Content-Type', 'application/json')
            .send({ message: 'fooMessage' })
            .expect(() => {
                expect(dao.insertMessage).toBeCalledWith('fooMessage');
            })
            .expect(201);
    });

    test('Should get an error on malformed request', () => {
        return request(app)
            .put('/')
            .set('Content-Type', 'application/json')
            .send({ nope: true })
            .expect(500);
    });

    test('Should get an error if the dao throws one', () => {
        dao.insertMessage.mockReturnValue(Promise.reject(new Error('Oh noes')));

        return request(app)
            .put('/')
            .set('Content-Type', 'application/json')
            .send({ message: 'fooMessage' })
            .expect(500)
            .expect((res: any) => {
                expect(res.error.text).toContain('Oh noes');
            });
    });
});