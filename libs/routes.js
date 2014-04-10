var mail = require('./mail');
var duino = require('./duino');


var parseRequest = function(request, next){
  var body = '';
  request.on('data', function(chunk){
    body += chunk;
  });

  request.on('end', function(){
    if(next) next(null, JSON.parse(body));
  });
};


var makeResponse = function(response, obj){
  response.writeHead(200, { 'Content-Type': 'application/json'});
  response.end(JSON.stringify(obj));
};


exports.home = function(){
  makeResponse(this.response, {'ok' : 'cool' });
};

exports.error = function(){
  console.error('error posting to this app :(')
  makeResponse(this.response, {'oh' : 'no' });
};

exports.newMail = function(){
  var self = this;
  parseRequest(this.request, function(err, message){
    makeResponse(self.response, {'ok' : 'cool' });

    if(!err && message){
      var subject = message.message_data.subject;

      mail.fetchMessage({
        accountId: message.account_id,
        messageId: message.message_data.message_id
      }, function(messageBody){
        mail.parseMessage({
          subject: subject,
          body: messageBody
        }, duino.broadcast);
      });
    }
  });
};
