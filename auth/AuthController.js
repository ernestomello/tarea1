var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var VerifyToken = require('./VerifyToken');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var User = require('../user/User');


var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config');


router.post('/register', async function(req, res) {
	var hashedPassword = bcrypt.hashSync(req.body.password, 8);
	const user = new User ({
		_id: new mongoose.Types.ObjectId(),
		name : req.body.name,
		email : req.body.email,
		password : hashedPassword
	});
	await user.save()
	.catch((err)=>{
		if (err) 
			return res.status(500).send("Error")
		
	})
	.then((user)=>{
		// crear token
		var token = jwt.sign({ id: user._id }, config.secret, {
		expiresIn: 300 // expira en 24 hours= 86400
		});
		res.render('index.ejs', {usuario: user});
		//res.status(200).send({ auth: true, token: token })
	});
		
});

router.post('/login', async function(req, res) {
	
	await User.findOne({ name: req.body.name })
	.catch((err, user) => {
		if (err) return res.status(500).send('Error.');
		if (!user) return res.status(404).send('No existe usuario.');
	})
	.then((user)=> {
		console.log(user);
		console.log(req.body.password);
		var passwordIsValid = bcrypt.compareSync(req.body.password,user.password);
		if (!passwordIsValid) return res.render('index.ejs',{usuario: null});
		var token = jwt.sign({ id: user._id }, config.secret, {
			expiresIn: 300 // expira en 24 hours
		});
		res.render('index.ejs',{usuario: user});
		//res.status(200).send({ auth: true, token: token });
	});
});

module.exports = router;