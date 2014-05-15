var Q = require('Q');
var mail = require('./mail');
var duino = require('./duino');
var config = require('../config');
var ejs = require('ejs');
var fs = require('fs');
var htmlFile = null;


var parseRequest = function(request){
  var deferred = Q.defer();
  var body = '';

  request.on('data', function(chunk){
    body += chunk;
  });

  request.on('end', function(){
    deferred.resolve(json.parse(body));
  });

  return deferred.promise;
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
  console.error('error posting to this app :(');
  makeResponse(this.response, {'oh' : 'no' });
};

exports.newMail = function(){
  var self = this;
  var message = {};

  parseRequest(this.request)
    .then(function(req){
      message.subject = req.message_data.subject;
      message.accountId = req.account_id;
      message.messageId = req.message_data.message_id;

      mail.fetchMessage(message)
        .then(mail.parseMessage)
        .then(duino.broadcast)
        .then(function(res){
          if(!res.err)
            makeResponse(self.response, {'ok' : 'cool' });
        });
    });
};
