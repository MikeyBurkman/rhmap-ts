
// Sourcemap support -- so we get nice stack traces
import 'source-map-support/register';

import * as cors from 'cors';
import * as env from 'env-var';
import * as express from 'express';
import * as mbaasApi from 'fh-mbaas-api';
import messageRouter from 'lib/messages';

const mbaasExpress = mbaasApi.mbaasExpress();

const app = express();

// Enable CORS for all requests
app.use(cors());

app.use('/sys', mbaasExpress.sys([]));

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
  const cwd = process.cwd();
  const stack = (err.stack || '').split('\n');
  res.status(500).json({
    msg: stack[0],
    stack: stack.slice(1)
      .map((s) => s.replace(cwd, '')) // Remove cwd to reduce the noise
      .map((s) => s.replace(/^\s*at\s*/, '')) // Remove unnecessary " at "
  });
  next(err);
});

// Important that this is last!
app.use(mbaasExpress.errorHandler());

const port = env('FH_PORT', env('OPENSHIFT_NODEJS_PORT', '8080').asString()).asPositiveInt();
const host = env('OPENSHIFT_NODEJS_IP', '0.0.0.0').asString();
app.listen(port, host, function () {
  console.log('App started at: ', new Date(), 'on port: ', port);
});
