/* Accessing the models (db) of each class
 */
const userModel = require('../model/userdb');
const prodModel = require('../model/productdb');
const ordModel = require('../model/orderdb');

const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const indexMiddleware = {
	validateReg: async function(req, res, next) {
		// REGISTER: check if email & userN already exists in db
		let { username, email } = req.body;
		
		try {
			// check if id and email are already in db
			let userExist = await userModel.findOne({user: username});
			let emailExist = await userModel.findOne({email: email});
			
			if (userExist) {
				res.send({status: 401, msg: 'That username already exists.'});
			}
			else if (emailExist) {
				res.send({status: 401, msg: 'That email address already exists.'});
			}
			else return next();
		} catch (e) {
			res.send({status: 500, mssg: 'Server error.'});
		}
	}
};

module.exports = indexMiddleware;
