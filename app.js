
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  //, user = require('./routes/user')
  //, testCtrl = require('./routes/test')
  , http = require('http')

  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  //app.use(express.bodyParser());
  //app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(require('less-middleware')({ src: __dirname + '/public' }));
  app.use(express.static(path.join(__dirname, 'public')));

});

var server = http.createServer(app);
var io = require('socket.io').listen(server);



app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
//app.get('/users', user.list);
//app.get('/test', testCtrl.show);

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

/*io.sockets.on('connection', function(socket) {
  console.log("connect from "+socket)
});*/


//chat part
io.of('/chat')
  .on('connection', function(socket) {

      var roomN;

      socket.on('join', function(roomName) {
        socket.join(roomName);
        roomN = roomName;
      });

      socket.on('say', function(message) {
        io.of('/chat').in(roomN).emit('say', message);
      });


  });

