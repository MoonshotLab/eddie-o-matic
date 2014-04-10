var Pathways = require('pathways');
var http = require('http');
var config = require('./config');
var pathways = Pathways();
var port = process.env.PORT || 3000;
var server = http.createServer(pathways);
var ContextIO = require('contextio');
var contextClient = new ContextIO.Client({
  key: process.env.CONTEXT_IO_KEY,
  secret: process.env.CONTEXT_IO_SECRET
});


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


var fetchMessage = function(accountId, messageId, messageSubject, next){
  contextClient
    .accounts(accountId)
    .messages(messageId)
    .body()
    .get(function(err, res){
      if(err) console.log(err);
      if(next) next({
        subject: messageSubject,
        content: res.body[0].content
      })
    });
};


var checkMessageForTerms = function(content, next){
  var terms = config.terms;
  var matches = {};
  console.log(content);
  if(next) next(matches);
};


// Routes
pathways
  .get('/', function(){
    makeResponse(this.response, {'ok' : 'cool' });
  })

  .get('/error', function(){
    makeResponse(this.response, {'oh' : 'no' });
  })

  .post('/new-email', function(){
    var self = this;
    parseRequest(this.request, function(err, message){
      makeResponse(self.response, {'ok' : 'cool' });

      if(!err){
        fetchMessage(
          message.account_id,
          message.message_data.message_id,
          message.message_data.subject,
          checkMessageForTerms
        );
      }
    });
});

server.listen(port);
console.log('server listening on', port);
