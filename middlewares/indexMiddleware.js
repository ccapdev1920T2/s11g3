/* Accessing the models (db) of each class
 */
const userModel = require('../model/userdb');
const prodModel = require('../model/productdb');
const ordModel = require('../model/orderdb');

function isEmail(email) {
	let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return regex.test(email);
}

const indexMiddleware = {
	validateLogin: function(req, res, next) {
		let { email, password } = req.body;
		
		if (!email || !password) { // check if fields are empty
			res.send(401);
		} else if (!isEmail(email)) { // check if it is a valid email
			res.send(401);
		}
		
		next(); // calls the next function
	},
	
	validateReg: function(req, res, next) {
		let { fname, lname, username, email, password, password_conf, address, phone, checkbox } = req.body;
		if (!fname || !lname || !username || !email || !password || !password_conf || !address || !phone || !checkbox)
			res.send(401);
		else if (!isEmail(email))
			return res.status(401).end('401, bad email');
		else if (password !== password_conf)
			return res.status(401).end('401, bad pass/conf');
		else next();
	},
	
	validateChangePW: function(req, res, next) {
		// validate pw length!!!
		
		let { oldpass, newpass, confnewpass } = req.body;
		
		if (!oldpass || !newpass || !confnewpass)
			return res.status(401).end('401, missing credentials');
		else if (newpass !== confnewpass)
			return res.status(401).end('401, bad newpass/newconf');
		else next();
	},
	
	getCheckEmail: function(req, res) {
		var emailIn = req.query.email;
		userModel.findOne({email: emailIn}, function(err, match) {
			if (match)
				res.send(match.email === emailIn);
			else res.send(false || !isEmail(emailIn));
		});
	},
	
	getCheckUser: function(req, res) {
		var userIn = req.query.user;
		userModel.findOne({user: userIn}, function(err, match) {
			if (match)
				res.send(match.user === userIn);
			else res.send(false);
		});
	}
};

module.exports = indexMiddleware;
