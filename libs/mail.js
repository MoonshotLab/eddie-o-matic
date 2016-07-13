var env = require('../env-config.js')();
var Q = require('q');
var ContextIO = require('contextio');


var contextClient = ContextIO({
  key       : env.CONTEXT_IO_KEY,
  secret    : env.CONTEXT_IO_SECRET,
  version   : 'lite'
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



// for some reason the context.io webhook just stops working
// after a week or so. This re-establishes it
exports.redoWebhooks = function(){
  return new Promise(function(resolve, reject){
    contextClient.users().get().then(function(users){
      users.forEach(function(user){
        if(user.first_name == 'Ricky' &&
        user.last_name == 'Catto'){
          deleteExistingWebHooks(user.id, function(){
            startWebhook(user.id);
            resolve();
          });
        }
      });
    });
  });
};



var startWebhook = function(userId){
  contextClient.users(userId).webhooks().post({
    callback_url      : env.ROOT_URL + '/new-email/new',
    failure_notif_url : env.ROOT_URL + '/new-email/error',
    include_body      : 1
  });
};



// delete all existing webhooks
var deleteExistingWebHooks = function(userId, next){
  var completions = 0;

  contextClient.users(userId).webhooks().get().then(function(hooks){
    if(hooks.length === 0) next();
    hooks.forEach(function(hook){

      contextClient.users(userId).webhooks(hook.webhook_id).delete().then(function(res){
        completions++;
        if(completions == hooks.length) next();
      });
    });
  });
};
