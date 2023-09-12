var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var bodyParser = require('body-parser');
var User = require('./User');


//var VerifyToken = require(__root + 'auth/VerifyToken');

router.use(bodyParser.urlencoded({ extended: true }));

router.get('/new', function(req,res){
    res.sendFile('/views/new.html', { root: '.' });
});

router.get('/login', function(req,res){
    res.sendFile('/views/login.html', { root: '.' });
});

router.post('/login', function(req,res){
    const user = User.find({name : "req.body.name"});
    res.render('index.ejs',{usuario: user});
});

module.exports = router;