var express = require('express');
var app = express();
var port =  3500;
var server = require('http').createServer(app);  
var io = require('socket.io')(server);
const VerifyToken = require('./auth/VerifyToken');
//var VerifyToken = require('auth/VerifyToken');
// Conexion a mongo
var mongoose = require('mongoose');
//var dev_db_url = 'mongodb+srv://ernesto:SmallWork1541@cluster0.yol4sxm.mongodb.net/?retryWrites=true&w=majority';
var dev_db_url = 'mongodb://localhost:27017';

var mongoDB = dev_db_url;
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
console.log('conectado Mongo');
global.__root   = __dirname + '/'; 



app.get('/', VerifyToken,function (req, res) {
  res.render('index.ejs',{usuario: null});
});

var UserController = require(__root + 'user/UserController');
app.use('/users', UserController);

app.use(express.static(__dirname + "/"));

var AuthController = require('./auth/AuthController');

app.use('/auth', AuthController);

app.set('view engine', 'ejs');

server.listen(port, function() {
  console.log('Express server listening on port ' + port);
});

const users =[];
const puntos={};
io.sockets.on('connection', function (socket) {
     
    
  socket.on('nuevo_conectado', function (user) {
      users.push(user);
      puntos[user] = 0;
      socket.broadcast.emit('user_conectado', user);
      socket.emit('puntaje_juego', {puntos : puntos , users : users});
  });

  socket.on('envio_mensaje', function (data) {
    socket.broadcast.emit('mensajes_externos', {data: data, user: users[socket.id]});
  });

  socket.on('sumo_clic',function (user) {
    puntos[user] += 1;
    socket.emit('puntaje_juego', {puntos : puntos , users : users });
  });
  
});
module.exports = app;