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

  request.post(url, {
    form: {
      access_token: env.SPARK_CORE_TOKEN,
      params: opts.matchedCategories[0].pinId + ',' + opts.floor
    }
  }, function(err, res) {
    console.log('attempting to post to server');
    console.log('result: ' + JSON.stringify(res));

    if (err || res.statusCode != 200) {
      console.log('error in posting to server');
      deferred.reject(err);
    } else {
      console.log('successfully sent to server');
    }

    deferred.resolve({
      err: err,
      res: res
    });
  });

  return deferred.promise;
};
