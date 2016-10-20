
// Sourcemap support -- so we get nice stack traces
import 'source-map-support/register';

import * as mbaasApi from 'fh-mbaas-api';
import * as express from 'express';
import * as cors from 'cors';
import * as messageRouter from 'lib/messages/routes';

const mbaasExpress = mbaasApi.mbaasExpress();

mbaasApi.sync.init('messages', {}, function (err) {
  if (err) {
    if (err instanceof Error) {
      console.error('Error sync init: ', err.stack);
    } else {
      console.error('Error sync init: ', err);
    }
  }
});

const app = express();

// Enable CORS for all requests
app.use(cors());

// Note: the order which we add middleware to Express here is important!
app.use('/mbaas', mbaasExpress.mbaas);

// Note: important that this is added just before your own Routes
app.use(mbaasExpress.fhmiddleware());

// Test routes
app.get('/', (req, res) => res.json({ success: true }));
app.get('/error', (req, res) => {
  throw new Error('Something wrong');
});

// Messages routes
app.use('/messages', messageRouter);

// Errors!
app.use(function (err: Error, req: express.Request, res: express.Response, next: (err: Error) => void) {
  const stack = (err.stack || '').split('\n');
  res.status(500).json({
    msg: stack[0],
    stack: stack.slice(1).map(s => s.replace(/^\s*at\s*/, ''))
  });
  next(err);
});

// Important that this is last!
app.use(mbaasExpress.errorHandler());

const port = process.env.FH_PORT || process.env.OPENSHIFT_NODEJS_PORT || 8100;
const host = process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';
app.listen(port, host, function () {
  console.log('App started at: ', new Date(), 'on port: ', port);
});
