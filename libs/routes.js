var env = require('../env-config.js')();
var mail = require('./mail');
var brains = require('./brains');
var duino = require('./duino');
var config = require('../config');
var ejs = require('ejs');
var fs = require('fs');
var low = require('lowdb');
var htmlFile = null;


var makeResponse = function(response, obj){
  response.writeHead(200, { 'Content-Type': 'application/json'});
  response.end(JSON.stringify(obj));
};


var makeHTML = function(){
  fs.readFile('./index.ejs', 'utf8', function(err, data){
    htmlFile = ejs.render(data, {
      ajaxURL: [
        'https://api.spark.io/v1/devices/',
        env.SPARK_CORE_ID,
        '/updateState'
      ].join(''),
      accessToken: env.SPARK_CORE_TOKEN,
      terms: config.categories
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

  var db = low('db.json', { storage: require('lowdb/lib/file-async') });

  if (!db.has('emails').value()) {
    db.set('emails', []).value()
  }

  var messageId = req.message_data.message_id;

  if (db.get('emails').find({id: messageId}).size().value() > 0) {
    // already in db
    console.log('duplicate mail received; skipping');
    return;
  } else {
    // add to db
    console.log('new mail received');
    db.get('emails').push({id: messageId}).value()
  }

  mail.parseRequest(this.request)
    .then(function(req){
      message.subject   = req.message_data.subject;
      message.accountId = req.account_id;
      message.messageId = messageId;
      message.from      = req.message_data.addresses.from.email;
      message.body      = req.message_data.bodies[0].content;
      message.contents  = message.subject + ' ' + message.body;

      brains.verifyFromBarkley(message)
        .then(brains.checkLength)
        .then(brains.checkForBannedTerms)
        .then(brains.findMatchingTerms)
        .then(brains.findFloor)
        .then(duino.broadcast)
        .then(function(res){
          console.log(
            '\n --------------',
            'new food alert... \n\n',
            'matched :',
            message.matchedLabels.join(', '),
            '\n',
            'subject :',
            message.subject,
            '\n',
            'floor   :',
            message.floor,
            '\n --------------'
          );

          makeResponse(self.response, {'ok' : 'cool' });
        }).fail(function(e){
          console.log('Error: ' + e);
        });
    });


};
