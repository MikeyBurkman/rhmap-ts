
// Sourcemap support -- so we get nice stack traces
import 'source-map-support/register'

import * as express from 'express';
import * as cors from 'cors';
import * as db from './db';

const mbaasApi = require('fh-mbaas-api');

const mbaasExpress = mbaasApi.mbaasExpress();

// list the endpoints which you want to make securable here
const securableEndpoints = ['/hello'];

mbaasApi.sync.init('messages', {}, function(err: Error|null) {
  if (err) {
    console.error('Error sync init: ', err.stack);
  }
});

const app = express();

// Enable CORS for all requests
app.use(cors());

// Note: the order which we add middleware to Express here is important!
app.use('/sys', mbaasExpress.sys(securableEndpoints));
app.use('/mbaas', mbaasExpress.mbaas);

// Note: important that this is added just before your own Routes
app.use(mbaasExpress.fhmiddleware());

app.get('/', (req, res) => res.json({success: true}));
app.get('/error', (req, res) => {
  throw new Error('Something wrong');
});

app.get('/messages', (req, res, next) => {
  db.collection('messages')
    .then(coll => coll.find().toArray())
    .then(values => res.json(values))
    .catch(next);
});

app.put('/messages', (req, res, next) => {
  const body = req.body;
  db.collection('messages')
    .then(coll => coll.insert({body: body}))
    .then(() => res.json(201))
    .catch(next);
});

// Errors!
app.use(function(err: Error, req: express.Request, res: express.Response, next: (err: Error) => void) {
  const stack = (err.stack || '').split('\n');
  res.status(500).json({
    msg: stack[0],
    stack: stack.slice(1).map(s => s.replace(/^\s*at\s*/, ''))
  });
  next(err);
});

// Important that this is last!
app.use(mbaasExpress.errorHandler());

const port = process.env.FH_PORT || process.env.OPENSHIFT_NODEJS_PORT || 8001;
const host = process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';
app.listen(port, host, function() {
  console.log('App started at: ', new Date(), 'on port: ', port);
});
