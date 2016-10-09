
import * as express from 'express';
import {Request, Response} from 'express';
import * as cors from 'cors';

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

// Errors!
app.use(function(err: any, req: Request, res: Response, next: (err: Error) => void) {
  var stack = err.stack.split('\n');
  res.status(500).json({
    msg: stack[0],
    stack: stack.slice(1).map(function(s: string) {
      return s.replace(/^\s*at\s*/, '');
    })
  });
  next(err);
});

// Important that this is last!
app.use(mbaasExpress.errorHandler());

app.get('/', (req: Request, res: Response) => res.json({success: true}));

const port = process.env.FH_PORT || process.env.OPENSHIFT_NODEJS_PORT || 8001;
const host = process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';
app.listen(port, host, function() {
  console.log('App started at: ', new Date(), 'on port: ', port);
});
