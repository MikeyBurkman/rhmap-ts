import express = require('express');
import bodyParser = require('body-parser');
const cors = require('cors');

export const route = express.Router();

route.use(cors());
route.use(bodyParser());

// GET REST endpoint - query params may or may not be populated
route.get('/', function(req, res) {
  console.log(new Date(), 'In hello route GET / req.query=', req.query);
  const world = req.query && req.query.hello || 'World';

  // see http://expressjs.com/4x/api.html#res.json
  res.json({msg: 'Hello ' + world});
});

// POST REST endpoint - note we use 'body-parser' middleware above to parse the request body in this route.
// This can also be added in application.js
// See: https://github.com/senchalabs/connect#middleware for a list of Express 4 middleware
route.post('/', function(req, res) {
  console.log(new Date(), 'In hello route POST / req.body=', req.body);
  const world = req.body && req.body.hello || 'World';

  // see http://expressjs.com/4x/api.html#res.json
  res.json({msg: 'Hello ' + world});
});


