/* Accessing the Users model */
const userModel = require('../model/userdb');
const prodModel = require('../model/productdb');
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
	
	validateConfirm: async function(req, res, next) {
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
	},
	
	validateAddCart: async function(req, res, next) {
		try {
			var prod = await prodModel.findOne({code: req.body.id});
			var userCart = await userModel.findOne({email: req.session.logUser.email}).populate('cart.item');
			var doesExist = userCart.cart.filter(item => item.item.code === prod.code);
			console.log(prod);
			if (doesExist.length === 0) return next();
			else if (prod.qty === 0) res.send({status: 401, msg: 'This item is out-of-stock.'});
			else res.send({status: 401, msg: 'Item already exists in your cart.'});
		} catch (e) {
			console.log(e);
			res.send({status: 500, msg: 'Server error. Could not validate.'});
		}
	},
	
	validateAddWish: async function(req, res, next) {
		try {
			var prod = await prodModel.findOne({code: req.body.id});
			var userWish = await userModel.findOne({email: req.session.logUser.email}).populate('wishlist');
			var doesExist = userWish.wishlist.filter(item => item.code === prod.code);
			if (doesExist.length === 0) return next();
			else res.send({status: 401, msg: 'Item already exists in your wishlist.'});
		} catch (e) {
			res.send({status: 500, msg: 'Server error. Could not validate.'});
		}
	}
};

module.exports = indexMiddleware;
