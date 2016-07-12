var Pathways = require('pathways');
var http = require('http');
var routes = require('./libs/routes');
var env = require('./env-config.js')();
var mail = require('./libs/mail');

var pathways = Pathways();
var port = env.PORT || 3000;
var server = http.createServer(pathways);

pathways
  .get('/', routes.home)
  .get('/error', routes.error)
  .post('/new-email', routes.newMail);

server.listen(port);
console.log('server listening on', port);

// resubscribe to the webhook once a day
mail.redoWebhooks();
setInterval(mail.redoWebhooks, 86400000);
