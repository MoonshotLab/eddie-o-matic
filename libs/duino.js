exports.broadcast = function(opts, next){
  console.log(opts, 'wee');
  if(next) next();
};
