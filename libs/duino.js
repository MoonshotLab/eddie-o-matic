var env = require('../env-config.js')();
var Q = require('q');
// var needle = require('needle');
var request = require('request');
var config = require('../config');

exports.broadcast = function(opts){
  console.log('broadcasting');
  var deferred = Q.defer();
  var url = [
    'https://api.spark.io/v1/devices/',
    env.SPARK_CORE_ID,
    '/updateState'
  ].join('');

  // var postParams = [
  //   'access_token=',
  //   env.SPARK_CORE_TOKEN,
  //   '&params=',
  //   opts.matchedCategories[0].pinId,
  //   ',',
  //   opts.floor
  // ].join('');
  //
  // console.log('url:', url);
  // console.log('postParams', postParams);
  //
  // needle.post(url, postParams, function(err, res){
  //   console.log('attemtping to post to server');
  //   if(err) {
  //     console.log('error in posting to server');
  //     deferred.reject(err);
  //   }
  //   else console.log('sent to server');
  //
  //   deferred.resolve({
  //     err: err,
  //     res: res
  //   });
  // });

  request.post({
    url: url,
    qs: {
      access_token: env.SPARK_CORE_TOKEN,
      params: opts.matchedCategories[0].pinId + ',' + opts.floor
    },
    method: 'POST'
  }, function(err, res) {
    console.log('attempting to post to server');
    if (err) {
      console.log('error in posting to server');
      deferred.reject(err);
    }
    else console.log('sent to server');

    deferred.resolve({
      err: err,
      res: res
    });
  });

  return deferred.promise;
};
