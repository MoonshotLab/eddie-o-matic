var config = require('../config');
var ContextIO = require('contextio');
var contextClient = new ContextIO.Client({
  key: process.env.CONTEXT_IO_KEY,
  secret: process.env.CONTEXT_IO_SECRET
});


exports.fetchMessage = function(opts, next){
  contextClient
    .accounts(opts.accountId)
    .messages(opts.messageId)
    .body()
    .get(function(err, res){
      if(err) console.log(err);
      if(next) next(res.body[0].content);
    });
};


exports.parseMessage = function(message, next){
  var body = message.body.toLowerCase();
  var subject = message.subject.toLowerCase();
  var content = subject + ' ' + body;
  var matches = [];
  var floor = 0;

  // Find matching terms
  config.terms.some(function(term){
    term.labels.some(function(label){
      if(content.indexOf(label) != -1){
        matches.push(term);
        return;
      }
    });
  });

  // Try a good guess
  if(content.indexOf('floor') != -1){
    var index = content.indexOf('floor');
    var sub = content.substring(index-10, index+10);
    if(sub.indexOf('1') != -1) floor = 1;
    if(sub.indexOf('2') != -1) floor = 2;
    if(sub.indexOf('3') != -1) floor = 3;
    if(sub.indexOf('4') != -1) floor = 4;
  }

  // Give up and look at entire string
  if(!floor){
    if(content.indexOf('1') != -1) floor = 1;
    if(content.indexOf('2') != -1) floor = 2;
    if(content.indexOf('3') != -1) floor = 3;
    if(content.indexOf('4') != -1) floor = 4;
  }

  // More guessing
  if(!floor){
    if(content.indexOf('first') != -1) floor = 1;
    if(content.indexOf('second') != -1) floor = 2;
    if(content.indexOf('third') != -1) floor = 3;
    if(content.indexOf('fourth') != -1) floor = 4;
  }

  if(matches.length && next) next({ matches: matches, floor: floor });
};
