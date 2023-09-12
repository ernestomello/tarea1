var express = require('express');
var app = express();
//var db = require('./db');
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



app.get('/', function (req, res) {
  res.render('index.ejs',{usuario: null});
  //res.status(200).send('API works.');
});

var UserController = require(__root + 'user/UserController');
app.use('/users', UserController);

/*var AuthController = require(__root + 'auth/AuthController');
app.use('/api/auth', AuthController);*/
app.use(express.static(__dirname + "/"));
var AuthController = require('./auth/AuthController');
app.use('/auth', AuthController);

app.set('view engine', 'ejs');

var port =  3500;

var server = app.listen(port, function() {
  console.log('Express server listening on port ' + port);
});

module.exports = app;