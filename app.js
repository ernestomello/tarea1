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
var Juego = require('./juego/Juego');
var JuegoUser = require('./juegoUser/juegouser');
var User = require('./user/User');


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

  socket.on('sumo_clic',function (data ) {
    puntos[data.user] += parseInt(data.puntos);
   
    if (puntos[data.user] >= 10){
      finalPartida(puntos,users, data.user)
      //socket.broadcast.emit('mensajes_externos', {data: "Ganó la Partida", user: data.user});
      io.sockets.emit('mensajes_externos', {data: "Ganó la Partida", user: data.user});
    }
    //socket.broadcast.emit('puntaje_juego', {puntos : puntos , users : users });
    io.sockets.emit('puntaje_juego', {puntos : puntos , users : users });

  });
  
});



async function finalPartida(puntos,users,user){

  await User.findOne({ name: user })
	.catch((err, usuario) => {
		if (err) return console.log(err);
		if (!usuario) return console.log('No existe usuario.');
	})
	.then( async (usuario)=> {
  const juego = new Juego ({
		_id: new mongoose.Types.ObjectId(),
		fecha : new Date(),
		user_winner : usuario,
		puntos : puntos[user]
	});
	await juego.save()
	.catch((err)=>{
		if (err) 
      console.log(err);
			//return res.status(500).send("Error")		
	})
	.then( async (juego)=>{
    
    largo = users.length;
    
    for (let i = 0; i < largo; i ++ ){   
      
      await User.findOne({ name: users[i] })
      .catch((err, usuario) => {
        if (err) return console.log(err);
        if (!usuario) return console.log('No existe usuario.');
      })
      .then( async (usuario)=>{ 
        const jugadas = new JuegoUser({
          _id: new mongoose.Types.ObjectId(),
          juego: juego,
          user : usuario,
          puntos : puntos[users[i]]
        });
        await jugadas.save()
        .catch((err)=>{
          if (err) 
            console.log(err);
            //return res.status(500).send("Error")      
        })
        .then((jugadas)=>{
          console.log("termino");
          //res.render('index.ejs', {usuario: user});
          });
      })
    };
		//res.status(200).send({ auth: true, token: token })
	  });
  
  })
}
module.exports = app;