
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
  app.use(express.compress());
  app.use(express.logger('dev'));
  //app.use(express.bodyParser());
  //app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(require('less-middleware')({ src: __dirname + '/public' }));

  /*app.use(expressUglify.middleware({ 
    src: __dirname + '/public',
    logLevel: 'info'
    //logger: new (winston.Logger)() // Specify your own winston logger or category
  }));*/

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
      var nickname;

      socket.on('join', function(param) {
        socket.join(param.roomName);
        roomN = param.roomName;

        nickname = param.nickname || "anonymous"

        socket.emit('say',{author: 'server', text: "Welcome to game "+roomN, at: new Date().getTime()})

      });

      socket.on('say', function(message) {
        io.of('/chat').in(roomN).emit('say', {author: nickname, text: message, at: new Date().getTime()});
      });


  });


var availableRooms = {};

var getOpenRoomList = function() {
  var res = [];
  for (key in availableRooms) {
    res.push({'name': key});
  }
  return res;
}

var updatePeopleOnDiscover = function() {
  io.of('/discover').emit('room', getOpenRoomList());
}

//game part
io.of('/game')
  .on('connection', function(socket) {

      var roomN;
      var nickname;



      socket.on('join', function(param) {

        socket.join(param.roomName);

        roomN = param.roomName;

        nickname = param.nickname || "anonymous"

        if (io.of('/game').clients(roomN).length == 1) {
            availableRooms[roomN] = 1;
            updatePeopleOnDiscover();
            socket.emit('owner');          
        }

        //socket.emit('start');
      });

      socket.on('disconnect', function() {
        console.log("disconnect");
        if (io.of('/game').clients(roomN).length <= 1) {
          delete availableRooms[roomN];
          updatePeopleOnDiscover();
        }
      });

      
      socket.on('updateGameField', function(opt) { 
        io.of('/game').in(roomN).emit('updateGameField', {'nickname': nickname, 'zone': opt });  
      });

      socket.on('gameover', function(opt) { 
        io.of('/game').in(roomN).emit('opponentGameOver', {'nickname': nickname });  
      });

      socket.on('leave', function() {
        console.log("disconnect");
        if (io.of('/game').clients(roomN).length <= 1) {
          delete availableRooms[roomN];
          updatePeopleOnDiscover();
        }
      });


      socket.on('start', function(opt) { 
        io.of('/game').in(roomN).emit('start');  
        delete availableRooms[roomN];
        updatePeopleOnDiscover();
      });

      socket.on('line', function(nbLine) {
        //doesn't work
        //io.of('/game').in(roomN).except(socket).emit('addLines', nbLine); 
        for (var id in io.of('/game').clients(roomN)) {
          var loopSockId = io.of('/game').clients(roomN)[id].id
          if(socket.id !== loopSockId) {
            //io.clients[id].send('addLines', nbLine);
            io.of('/game').in(roomN).socket(loopSockId).emit('addLines', nbLine);
          }
        }
      });

  });

io.of('/discover')
  .on('connection', function(socket) {
    socket.on('ask', function(param) {
        socket.emit('room',getOpenRoomList());
    });
  });

