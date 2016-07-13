var env = require('../env-config.js')();
var Q = require('q');
var needle = require('needle');
var config = require('../config');

exports.broadcast = function(opts){
  var deferred = Q.defer();
  var url = [
    'https://api.spark.io/v1/devices/',
    env.SPARK_CORE_ID,
    '/updateState'
  ].join('');

  var postParams = [
    'access_token=',
    env.SPARK_CORE_TOKEN,
    '&params=',
    opts.matches[0].pinId,
    ',',
    opts.floor
  ].join('');

  needle.post(url, postParams, function(err, res){
    if(err) deferred.reject(err);
    else console.log('sent to server');

    deferred.resolve({
      err: err,
      res: res
    });
  });

  return deferred.promise;
};
