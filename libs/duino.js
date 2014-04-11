var needle = require('needle');

exports.broadcast = function(opts, next){
  var url = [
    'https://api.spark.io/v1/devices/',
    process.env.SPARK_CORE_ID,
    '/updateState'
  ].join('');

  var degrees = 165;
  if(opts.floor == 1) degrees = 132;
  else if(opts.floor == 2) degrees = 87;
  else if(opts.floor == 3) degrees = 43;
  else if(opts.floor == 4) degrees = 10;

  var postParams = [
    'access_token=',
    process.env.SPARK_CORE_TOKEN,
    '&params=',
    opts.matches[0].pinId,
    ',',
    degrees
  ].join('');

  needle.post(url, postParams, function(err, res){
    if(err) console.error(err);
    else console.log('sent to server');

    if(next) next(err, res);
  });
};
