var needle = require('needle');

exports.broadcast = function(opts, next){
  var url = [
    'https://api.spark.io/v1/devices/',
    process.env.SPARK_CORE_ID,
    '/updateState'
  ].join('');

  var degrees = 90;
  if(opts.floor == 1) degrees = 157;
  else if(opts.floor == 2) degrees = 115;
  else if(opts.floor == 3) degrees = 65;
  else if(opts.floor == 4) degrees = 20;

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
