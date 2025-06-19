const {spawn} = require('child_process');
const io = require('socket.io-client');
const assert = require('assert');
let server;

function waitForServer(port, done){
  server = spawn('node', ['src/app.js'], {
    env: Object.assign({}, process.env, {PORT: String(port)})
  });
  server.stdout.on('data', (data)=>{
    if(data.toString().includes('Express server listening')){
      done();
    }
  });
}

describe('socket.io server', function(){
  this.timeout(10000);
  const port = 4001;

  before(done => {
    waitForServer(port, done);
  });

  after(() => {
    server.kill();
  });

  it('responds to room list', function(done){
    const socket = io(`http://localhost:${port}/discover`);
    socket.on('room', rooms => {
      assert.ok(Array.isArray(rooms));
      socket.disconnect();
      done();
    });
    socket.emit('ask');
  });

  it('allows chat join', function(done){
    const chat = io(`http://localhost:${port}/chat`);
    chat.on('say', () => {
      chat.disconnect();
      done();
    });
    chat.on('connect', () => {
      chat.emit('join', {roomName:'test', nickname:'tester'});
    });
  });
});
