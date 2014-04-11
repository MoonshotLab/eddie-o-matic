var Pathways = require('pathways');
var http = require('http');
var routes = require('./libs/routes');

var pathways = Pathways();
var port = process.env.PORT || 3000;
var server = http.createServer(pathways);

pathways
  .get('/', routes.home)
  .get('/error', routes.error)
  .post('/new-email', routes.newMail);

server.listen(port);
console.log('server listening on', port);
