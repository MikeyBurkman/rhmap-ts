var express = require('express');
var bodyParser = require('body-parser');
var Promise = require('bluebird');
var mbaasApi = Promise.promisifyAll(require('fh-mbaas-api'));
var expressPromise = require('express-promise');
var Cacher = require('./cacher');

var route = module.exports = new express.Router();

route.use(expressPromise());
route.use(bodyParser.json());

(function() {
  var cacher = new Cacher({
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
    
    var params = Object.keys(req.body).length > 0 ? req.body : req.query;

    var key = {
      method: req.params.verb,
      params: params
    };
    
    return res.json(cacher.get(key));
  });
})();