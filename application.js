var mbaasApi = require('fh-mbaas-api');
var express = require('express');
var mbaasExpress = mbaasApi.mbaasExpress();
var cors = require('cors');

// list the endpoints which you want to make securable here
var securableEndpoints;
securableEndpoints = ['/hello'];

var app = express();

// Enable CORS for all requests
app.use(cors());

// Note: the order which we add middleware to Express here is important!
app.use('/sys', mbaasExpress.sys(securableEndpoints));
app.use('/mbaas', mbaasExpress.mbaas);

// Note: important that this is added just before your own Routes
app.use(mbaasExpress.fhmiddleware());

app.use('/hello', require('./lib/hello.js')());

app.use('/call', require('./lib/callRoutes.js'));

// Errors!
app.use(function(err, req, res, next) {
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

var port = process.env.FH_PORT || process.env.OPENSHIFT_NODEJS_PORT || 8001;
var host = process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';
app.listen(port, host, function() {
  console.log('App started at: ', new Date(), 'on port: ', port);
});
