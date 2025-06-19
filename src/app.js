
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
var io = require('socket.io')(server);

//configure for production (legacy settings removed for socket.io 2)


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

        updatePeopleInRoom(roomN);

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
    var room = io.of("/game").adapter.rooms[roomName];
    if (!room) {
      return;
    }
    room.people = room.people || [];
    return room;
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
        if ((io.of('/game').adapter.rooms[roomN]?.length || 0) === 1) {
            getRoom(roomN).owner = nickname;
            availableRooms[roomN] = {'owner': nickname};
            updatePeopleOnDiscover();
            socket.emit('owner');
        }
        io.of('/chat').in(roomN).emit('say',{author: 'server', text: nickname+" has join the game", at: new Date().getTime()});
        updatePeopleInRoom(roomN);
        //socket.emit('start');
      });

      var requestNewOwner = function() {
              var clients = Object.keys(io.of('/game').adapter.rooms[roomN]?.sockets || {});
              var newOwnerId = clients[0];
              if (newOwnerId) {
                io.of('/game').to(newOwnerId).emit('owner');
                getRoom(roomN).owner = newOwnerId;
              }
      }

      //awful code
      //TODO need to rewrite and not put attr on socket !
      var onleave = function() {
        console.log("onleave");
        //if no room
        if (!getRoom(roomN)) {
          return;
        }
        var people = getRoom(roomN).people;
        people = _.without(people,nickname);

        getRoom(roomN).people = people;

        updatePeopleInRoom(roomN);

        if(!socket) {
          return;
        }

        socket.leave(roomN);

        //if you are the only one in the room
        if ((io.of('/game').adapter.rooms[roomN]?.length || 0) <= 0) {
          delete availableRooms[roomN];
          updatePeopleOnDiscover();
          
          //leave the room;
         
          return;
        }

        //if leaving guy is the owner
        console.log("leaving");
        console.log(getRoom(roomN).owner +" / "+nickname);
          if (getRoom(roomN).owner == nickname) {
              requestNewOwner();
          }

        updatePeopleInRoom(roomN);
      };

      socket.on('win', _.once(function() {
        io.of('/chat').in(roomN).emit('say',{author: 'server', text: nickname+" has won the game !", at: new Date().getTime()});
        io.of('/chat').in(roomN).emit('win');
      }));

      socket.on('disconnect',function() {
        io.of('/chat').in(roomN).emit('say',{author: 'server', text: nickname+" has left the game", at: new Date().getTime()});
        onleave();
      });
      socket.on('leave', function() {
        //do nothing
      });

      
      socket.on('updateGameField', function(opt) { 
        //io.of('/game').in(roomN).emit('updateGameField', {'nickname': nickname, 'zone': opt });  
        sendToAllButYou('updateGameField', {'nickname': nickname, 'zone': opt }, '/game', roomN, socket);
      });

      socket.on('gameover', function(opt) { 
        //io.of('/game').in(roomN).emit('opponentGameOver', {'nickname': nickname });  
        sendToAllButYou('opponentGameOver', {'nickname': nickname }, '/game', roomN, socket);
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
          sendToAllButYou('addLines', nbLine-1, '/game', roomN, socket);
        } else {
          sendToAllButYou('addLines', nbLine, '/game', roomN, socket);
        }
        
      });

      var sendToAllButYou = function(msgType, msgContent, namespace, room, sock) {
        sock.to(room).emit(msgType, msgContent);
      }

  });

io.of('/discover')
  .on('connection', function(socket) {
    socket.on('ask', function(param) {
        socket.emit('room',getOpenRoomList());
    });
  });

