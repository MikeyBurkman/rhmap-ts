
var Promise = require('bluebird');
var mbaasApi = Promise.promisifyAll(require('fh-mbaas-api'));
var md5 = require('md5');

export interface CacherArgs<T> {
  fn: (key: any) => Promise<T>,
  expire?: number,
  keyTransform?: (key: any) => any
}

export class Cacher<T> {
  
  private args: CacherArgs<T>;
  
  constructor(args: CacherArgs<T>) {
    this.args = {
      fn: args.fn,
      expire: args.expire || 60,
      keyTransform: args.keyTransform || ((key: string) => md5(JSON.stringify(key)))
    };
  }
  
  get(key): Promise<T> {
    var keyStr = this.args.keyTransform(key);
        
    return mbaasApi.cacheAsync({
      act: 'load',
      key: keyStr
    })
    .then(function(found) {
      if (found) {
        return JSON.parse(found);
      }
      
      return this.args.fn(key)
    })
    .then(function(data) {
      // cache it asynchronously
      mbaasApi.cacheAsync({
        act: 'save',
        key: keyStr,
        value: JSON.stringify(data),
        expire: this.args.expire
      })
      .catch(function(err) {
        console.error('Error saving to cache: ', err.stack);
      });
      
      return data;
    });
  };
}