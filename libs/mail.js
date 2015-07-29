var env = require('../env-config.js')();
var Q = require('q');
var ContextIO = require('contextio');
var contextClient = new ContextIO.Client({
  key: env.CONTEXT_IO_KEY,
  secret: env.CONTEXT_IO_SECRET
});


exports.parseRequest = function(request){
  var deferred = Q.defer();
  var body = '';

  request.on('data', function(chunk){
    body += chunk;
  });

  request.on('end', function(){
    deferred.resolve(JSON.parse(body));
  });

  return deferred.promise;
};


// reach out to the context server and get the content of the e-mail
exports.fetchMessage = function(message){
  var deferred = Q.defer();

  contextClient
    .accounts(message.accountId)
    .messages(message.messageId)
    .body()
    .get(function(err, res){
      if(err) console.log(err);
      if(res && res.body && res.body.length){
        message.body = res.body[0].content.toLowerCase();
        message.contents = [message.subject.toLowerCase(),
          message.body.toLowerCase()].join(' ');
        deferred.resolve(message);
      }
    });

  return deferred.promise;
};
