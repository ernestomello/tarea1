var jwt = require('jsonwebtoken');
var config = require('../config');


function verifyToken(req, res, next) {
	var token = req.headers['x-access-token'];
	if (!token)
		return res.status(403).render('index.ejs',{usuario: null});
	jwt.verify(token, config.secret, function(err, decoded) {
		if (err)
		return res.status(500).render('index.ejs',{usuario: null});
		req.userId = decoded.id;
		next();
	});
}
module.exports = verifyToken;