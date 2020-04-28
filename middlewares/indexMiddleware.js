/* Accessing the Users model */
const userModel = require('../model/userdb');
const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const indexMiddleware = {
	validateReg: async function(req, res, next) {
		// REGISTER: check if email & userN already exists in db
		let { username, email } = req.body;
		
		try {
			// check if id and email are already in db
			let userExist = await userModel.findOne({user: username});
			let emailExist = await userModel.findOne({email: email});
			if (userExist)
				res.send({status: 401, msg: 'That username already exists.'});
			else if (emailExist)
				res.send({status: 401, msg: 'That email address already exists.'});
			else return next();
		} catch (e) {
			res.send({status: 500, msg: 'Server error. Could not validate.'});
		}
	},
	
	validateConfirm: async function(req, res) {
		let { confcode } = req.body;
		
		try {
			let user = await userModel.findOne({email: req.session.logUser.email});
			if (user.isConfirmed)
				res.send({status: 401, msg: 'You are already verified!'});
			else if (confcode !== user.otp)
				res.send({status: 401, msg: 'Wrong OTP inputted.'});
			else return next();
		}
		catch (e) {
			res.send({status: 500, msg: 'Server error. Could not validate.'});
		}
	}
};

module.exports = indexMiddleware;
