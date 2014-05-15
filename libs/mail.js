var Q = require('q');
var config = require('../config');
var ContextIO = require('contextio');
var contextClient = new ContextIO.Client({
  key: process.env.CONTEXT_IO_KEY,
  secret: process.env.CONTEXT_IO_SECRET
});


var findFloor = function(content){
  var floor = 1;

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
    var subst = content.substring(0, 20);
    if(subst.indexOf('1') != -1) floor = 1;
    else if(subst.indexOf('2') != -1) floor = 2;
    else if(subst.indexOf('3') != -1) floor = 3;
    else if(subst.indexOf('4') != -1) floor = 4;
  }

  return floor;
};


exports.fetchMessage = function(message){
  var deferred = Q.defer();

  contextClient
    .accounts(message.accountId)
    .messages(message.messageId)
    .body()
    .get(function(err, res){
      if(err) console.log(err);
      if(res && res.body){
        message.body = res.body[0].content;
        deferred.resolve(message);
      }
    });

  return deferred.promise;
};


exports.parseMessage = function(message){
  var deferred = Q.defer();
  var body = message.body.toLowerCase();
  var subject = message.subject.toLowerCase();
  var content = subject + ' ' + body;

  if(content.length < 700){
    var matches = [];
    var floor = findFloor(content);

    // Find matching terms
    config.terms.some(function(term){
      term.labels.some(function(label){
        if(content.indexOf(label) != -1){
          matches.push(term);
          return;
        }
      });
    });

    if(matches.length){
      var matchedNames = [];
      matches.forEach(function(match){
        matchedNames.push(match.name);
      });

      console.log(
        '\n',
        'new food alert... \n',
        'matched:',
        matchedNames.join(' '),
        '\n',
        'subject:',
        message.subject,
        'floor:',
        floor,
        '\n --------------'
      );

      message.matches = matches;
      message.floor = floor;

      deferred.resolve(message);
    }
  }

  return deferred.promise;
};
