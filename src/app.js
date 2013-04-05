
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
var _ = require('lodash');



app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.compress());
  app.use(express.logger('dev'));
  //app.use(express.static(__dirname+"/public", {maxAge: 60*60*24}));
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

//configure for production
io.enable('browser client minification');
io.enable('browser client etag');
io.enable('browser client gzip');
io.set('log level',1);
io.set('flash policy port',-1);


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
    res.push({'name': key, 'owner': availableRooms[key].owner});
  }
  return res;
}

var updatePeopleOnDiscover = function() {
  io.of('/discover').emit('room', getOpenRoomList());
}

var updatePeopleInRoom = function(room) {
  io.of('/chat').in(room).emit('people', getRoom(room).people);
}

var getRoom = function (roomName) {
    if (!io.sockets.manager.rooms["/game/"+roomName]) {
      return;
    }
    io.sockets.manager.rooms["/game/"+roomName].people =  io.sockets.manager.rooms["/game/"+roomName].people ||[];
    return io.sockets.manager.rooms["/game/"+roomName];
};


//game part
io.of('/game')
  .on('connection', function(socket) {

      //global vars of scope
      var roomN;
      var nickname;



      socket.on('join', function(param) {

        socket.join(param.roomName);

        roomN = param.roomName;

        nickname = socket.nickname = param.nickname || "anonymous";


        getRoom(roomN).people.push(nickname);

        if (io.of('/game').clients(roomN).length == 1) {
            getRoom(roomN).owner = nickname;
            availableRooms[roomN] = {'owner': nickname};
            updatePeopleOnDiscover();
            socket.emit('owner');          
        }

        //socket.emit('start');
      });

      var requestNewOwner = function() {
              var newOwner = io.of(roomN).clients(roomN)[0];
              if (newOwner) {
                console.log(newOwner);
                 //newOwner.emit('owner');
                 //getRoom(roomN).owner = newOwner.nickname;
              }
      }

      //awful code
      var onleave = function() {

        if (!getRoom(roomN)) {
          return;
        }
        var people = getRoom(roomN).people;
        people = _.without(people,nickname);

        if(!socket) {
          return;
        }

        if (io.of('/game').clients(roomN).length <= 1) {
          delete availableRooms[roomN];
          updatePeopleOnDiscover();
          
          //leave the room;
          socket.leave(roomN);
          return;
        } else {

        //leave the room;
        socket.leave(roomN);
          //if leaving guy is the owner
          console.log("leaving");
          console.log(getRoom(roomN).owner);
          if (getRoom(roomN).owner == nickname) {
              requestNewOwner();
          }
        } 
      }

      socket.on('win', function() {
        io.of('/chat').in(roomN).emit('say',{author: 'server', text: nickname+" has won the game !", at: new Date().getTime()});
      });

      socket.on('disconnect',onleave);
      socket.on('leave', onleave);

      
      socket.on('updateGameField', function(opt) { 
        //io.of('/game').in(roomN).emit('updateGameField', {'nickname': nickname, 'zone': opt });  
        sendToAllButYou('updateGameField', {'nickname': nickname, 'zone': opt }, '/game', roomN, socket.id);
      });

      socket.on('gameover', function(opt) { 
        //io.of('/game').in(roomN).emit('opponentGameOver', {'nickname': nickname });  
        sendToAllButYou('opponentGameOver', {'nickname': nickname }, '/game', roomN, socket.id);
      });

     


      socket.on('start', function(opt) { 
        io.of('/game').in(roomN).emit('start');  
        delete availableRooms[roomN];
        updatePeopleOnDiscover();
      });

      socket.on('line', function(nbLine) {
        //doesn't work
        //io.of('/game').in(roomN).except(socket).emit('addLines', nbLine); 
       /* for (var id in io.of('/game').clients(roomN)) {
          var loopSockId = io.of('/game').clients(roomN)[id].id
          if(socket.id !== loopSockId) {
            //io.clients[id].send('addLines', nbLine);
            io.of('/game').in(roomN).socket(loopSockId).emit('addLines', nbLine-1);
          }
        }*/
        if (nbLine <4) {
          sendToAllButYou('addLines', nbLine-1, '/game', roomN, socket.id);  
        } else {
          sendToAllButYou('addLines', nbLine, '/game', roomN, socket.id);  
        }
        
      });

      var sendToAllButYou = function(msgType, msgContent, of, room, socketId) {
        for (var id in io.of(of).clients(room)) {
          var loopSockId = io.of(of).clients(room)[id].id
          if(socketId !== loopSockId) {
            //io.clients[id].send('addLines', nbLine);
            io.of(of).in(room).socket(loopSockId).emit(msgType, msgContent);
          }
        }
      }

  });

io.of('/discover')
  .on('connection', function(socket) {
    socket.on('ask', function(param) {
        socket.emit('room',getOpenRoomList());
    });
  });

