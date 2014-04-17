var mail = require('./mail');
var duino = require('./duino');
var config = require('../config');
var ejs = require('ejs');
var fs = require('fs');
var htmlFile = null;


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


var makeHTML = function(){
  fs.readFile('./index.ejs', 'utf8', function(err, data){
    htmlFile = ejs.render(data, {
      ajaxURL: [
        'https://api.spark.io/v1/devices/',
        process.env.SPARK_CORE_ID,
        '/updateState'
      ].join(''),
      accessToken: process.env.SPARK_CORE_TOKEN,
      terms: config.terms,
      floors: config.floors
    });
  });
}();


exports.home = function(){
  this.response.writeHead(200, { 'Content-Type': 'text/html'});
  this.response.end(htmlFile);
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
