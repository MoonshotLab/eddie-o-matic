var config = require('../config');
var Q = require('q');


// if one of these terms is matched, then ignore
exports.checkForBannedTerms = function(message){
  var dealBreakers = false;
  config.bannedTerms.some(function(term){
    if(message.contents.indexOf(term) != -1)
      return;
  });

  if(!dealBreakers) return Q.resolve(message);
  else Q.reject('found banned terms');
};


// ignore daily planet and other long e-mails
exports.checkLength = function(message){
  if(message.contents.length < 700)
    return Q.resolve(message);
  else Q.reject('message not long enough');
};


exports.findMatchingTerms = function(message){
  message.matchedCategories = [];
  message.matchedLabels = [];

  config.categories.some(function(term){
    term.labels.some(function(label){
      if(message.contents.indexOf(label) != -1){
        message.matchedCategories.push(term);
        message.matchedLabels.push(label);
        return;
      }
    });
  });

  if(message.matchedCategories.length)
    return Q.resolve(message);
  else return Q.reject('no matching terms found');
};


exports.findFloor = function(message){
  var floor = 0;

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

  if(!floor) floor = 1;

  return Q.resolve(message);
};
