
var Promise = require('bluebird');
var mbaasApi = Promise.promisifyAll(require('fh-mbaas-api'));
var md5 = require('md5');

module.exports = Cacher;

function Cacher(args) {
  var fn = args.fn;
  var expire = args.expire || 60;
  var keyTransform = args.keyTransform || function(key) {
    return md5(JSON.stringify(key));
  };
  
  this.get = function fromCache(key) {
    var keyStr = keyTransform(key);
    
    console.log('Key = ', keyStr);
    
    return mbaasApi.cacheAsync({
      act: 'load',
      key: keyStr
    })
    .then(function(found) {
      if (found) {
        console.log('### Found in cache');
        return JSON.parse(found);
      }
      
      console.log('### Not found in cache');
      return fn(key)
    })
    .then(function(data) {
      // cache it asynchronously
      mbaasApi.cacheAsync({
        act: 'save',
        key: keyStr,
        value: JSON.stringify(data),
        expire: expire
      })
      .catch(function(err) {
        console.error('Error saving to cache: ', err.stack);
      });
      
      return data;
    });
  };
}