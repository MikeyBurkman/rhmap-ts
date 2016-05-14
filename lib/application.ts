
require('source-map-support').install();

const mbaasApi = require('fh-mbaas-api');
import express = require('express');
const mbaasExpress = mbaasApi.mbaasExpress();
const cors = require('cors');

import helloRoutes = require('./app/helloRoutes');
import callRoutes = require('./app/callRoutes');

// list the endpoints which you want to make securable here
const securableEndpoints = ['/hello'];

mbaasApi.sync.init('messages', {}, function(err) {
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

app.use('/hello', helloRoutes.route);

app.use('/call', callRoutes.route);

// Errors!
app.use(function(err: any, req: express.Request, res: express.Response, next) {
  var stack = err.stack.split('\n');
  res.status(500).json({
    msg: stack[0],
    stack: stack.slice(1).map(function(s) {
      return s.replace(/^\s*at\s*/, '');
    })
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
