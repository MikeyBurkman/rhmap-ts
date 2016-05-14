
import express = require('express');
import bodyParser = require('body-parser');
import Promise = require('bluebird');
var expressPromise = require('express-promise');
import cacher = require('./cacher');

var mbaasApi: any = Promise.promisifyAll(require('fh-mbaas-api'));

export const route = express.Router();

route.use(expressPromise());
route.use(bodyParser.json());

var cacherInstance = new cacher.Cacher<string>({
  expire: 600,
  fn: function(key) {
    return mbaasApi.serviceAsync({
      guid: '3axp2hk46g2aginkejtmojdm',
      path: '/echo',
      method: key.method,
      params: key.params
    });
  }
});

route.post('/:verb', function(req, res) {
  if (['GET', 'POST', 'PUT', 'DELETE'].indexOf(req.params.verb) === -1) {
    return res.status(400).json({
      msg: 'Unacceptable verb: ' + req.params.verb
    });
  }
  
  const params = Object.keys(req.body).length > 0 ? req.body : req.query;

  const key = {
    method: req.params.verb,
    params: params
  };
  
  return res.json(cacherInstance.get(key));
});