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
  var floor = 1;

  // Find matching terms
  config.terms.some(function(term){
    term.labels.some(function(label){
      if(content.indexOf(label) != -1){
        matches.push(term);
        return;
      }
    });
  });

  // Try a good guess, look for the word floor and any numbers
  // which are close to the word
  if(content.indexOf('floor') != -1){
    var index = content.indexOf('floor');
    var sub = content.substring(index-10, index+10);
    if(sub.indexOf('1') != -1) floor = 1;
    else if(sub.indexOf('2') != -1) floor = 2;
    else if(sub.indexOf('3') != -1) floor = 3;
    else if(sub.indexOf('4') != -1) floor = 4;
  }

  // Give up and look at entire string, searching for
  // numbers and their appropriate suffix
  if(!floor){
    if(content.indexOf('1st') != -1) floor = 1;
    else if(content.indexOf('2nd') != -1) floor = 2;
    else if(content.indexOf('3rd') != -1) floor = 3;
    else if(content.indexOf('4th') != -1) floor = 4;
  }

  // More guessing
  if(!floor){
    if(content.indexOf('first') != -1) floor = 1;
    else if(content.indexOf('second') != -1) floor = 2;
    else if(content.indexOf('third') != -1) floor = 3;
    else if(content.indexOf('fourth') != -1) floor = 4;
  }

  // Look at the first 20 characters... trying to
  // avoid the e-mail signature
  if(!floor){
    var sub = content.substring(0, 20);
    if(sub.indexOf('1') != -1) floor = 1;
    else if(sub.indexOf('2') != -1) floor = 2;
    else if(sub.indexOf('3') != -1) floor = 3;
    else if(sub.indexOf('4') != -1) floor = 4;
  }

  console.log('new food alert... \n', content, '\n --------------');
  if(matches.length && next) next({ matches: matches, floor: floor });
};
