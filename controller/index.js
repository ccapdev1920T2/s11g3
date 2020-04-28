const fs = require('fs');
const handlebars = require('handlebars');
const nodemailer = require('nodemailer');
const randtoken = require('rand-token');

/* Accessing the models (db) of each class
 */
const userModel = require('../model/userdb');
const prodModel = require('../model/productdb');
const ordModel = require('../model/orderdb');

const bcrypt = require('bcrypt');
const saltRounds = 10;

/* Object constructors */
function User(fName, lName, email, user, pass, contact, addr, otp) {
	this.fName = fName;
	this.lName = lName;
	this.email = email;
	this.user = user;
	this.pass = pass;
	this.contact = contact;
	this.addr = addr;
	this.otp = otp;
	this.isConfirmed = false;
	this.cart = [];
	this.wishlist = [];
}
function Product(name, code, desc, price, qty, size, filename, category) {
	this.name = name;
	this.code = code;
	this.desc = desc;
	this.price = price;
	this.qty = qty;
	this.size = size;
	this.filename = filename;
	this.category = [...category];
}
/* bound to change, will think about how the object's data are collected first.
 */
function Order(buyer, products) {
	this.dateOrd = Date.now();
	this.status = 'PROCESSING';
	this.buyer = buyer;
	this.products = [...products];
}

function getCateg(categ) {
	switch (categ) {
		case 'womens': return new RegExp("Women's", "g");
		case 'mens': return "Men's";
		case 'kids': return "Kids";
		case 'waccessories': return "Women's Accessories";
		case 'wclothes': return "Women's Clothes";
		case 'wshoes': return "Women's Shoes";
	}
}

function getStrMonth(mon) {
	var d = Date.parse(mon + " 1, 2020");
	return !isNaN(d) ? new Date(d).getMonth() + 1 : -1;
}

function sendConfEmail(email, name, otp) {
	// get html of email body
	fs.readFile('./assets/email.html', 'utf8', function(e, bodyData) {
		// render it with hbs, filling in data
		var template = handlebars.compile(bodyData);
		var htmlToSend = template({name: name, otp: otp});
		
		// sending email
		var smtpTransport = nodemailer.createTransport({
			service: "Gmail",
			auth: {
				user: process.env.EMAIL_ADDR,
				pass: process.env.EMAIL_PASS
			}
		});
		var mailOpts = {
			from: 'TheShopPH',
			to: email, 
			subject: 'Welcome to TheShop!',
			html: htmlToSend
		};
		smtpTransport.sendMail(mailOpts, function(err) {
			if (err) console.log(err);
			smtpTransport.close();
		});
	});
}



/** Indexian of functions used for app functions
 */
const indexFunctions = {
	
	/*
	 * GET METHODS
	 */
	
	getHome: function(req, res) {
		if (req.session.logUser) { // check if there's a logged in user
			res.render('home', {
				title: 'TheShop',
				signedIn: true,
				message: 'Welcome, ' + req.session.logUser.fName + " " + req.session.logUser.lName + ', to TheShop!'
			});
		} else { // if no user logged in
			res.render('home', {
				title: 'TheShop',
				signedIn: false,
				message: "Welcome to TheShop! Log in or sign up to access our features." 
			});
		}
	},
	
	getLogin: async function(req, res) {
		if (req.session.logUser) { // check if there's a user logged in
			res.redirect('/'); // go back to home
		} else {
			res.render('login', { // just renders login.hbs
				title: 'TheShop - Login'
			});
		}
	},
	
	getStats: function(req, res) {
		res.render('stats', {
			title: 'TheShop - My Stats'
		});
	},
	
	getStatsQuery: async function(req, res) {
		let {statmonth, statyear} = req.query;
		if (!statmonth || !statyear) {
			let aggrPipelines = [
				{'$lookup': {
					'from': 'Users',
					'localField': 'buyer',
					'foreignField': '_id',
					'as': 'buyer'
				}},
				{'$match': { '$and': [
					{'buyer.email': req.session.logUser.email},
					{'$expr': {'$eq': [{'$month': '$dateOrd'}, getStrMonth(statmonth)]}},
					{'$expr': {'$eq': [{'$year': '$dateOrd'}, Number.parseInt(statyear)]}}
				]
				}},
				{'$lookup': {
					'from': 'Products',
					'localField': 'products.item',
					'foreignField': '_id',
					'as': 'prods'
				}}
			];
			var ords = await ordModel.aggregate(aggrPipelines);
			console.log(ords);
			
		} else {
			res.render('stats', {
				title: 'TheShop - My Stats',
				month: statmonth,
				year: statyear,
				ords: ords
			});
		}
	},
	
	getAccount: function(req, res) {
		if (req.session.logUser) {
			res.render('account', {
				title: 'TheShop - My Acount',
				user: req.session.logUser.user,
				fName: req.session.logUser.fName,
				lName: req.session.logUser.lName,
				email: req.session.logUser.email,
				addr: req.session.logUser.addr,
				contact: req.session.logUser.contact
			});
		} else res.redirect('/');
	},
	
	getRegister: function(req, res) {
		res.render('registration', {
			title: 'TheShop - Registration'
		});
	},
	
	getChangePW: function(req, res) {
		if (req.session.logUser) {
			res.render('changepass', {
				title: 'TheShop - Change Password'
			});
		} else res.redirect('/');
	},
	
	getConfirm: function(req, res) {
		
	},
	
	getProducts: function(req, res) {
		prodModel.find({}, function(err, match) {
			if (err) return res.status(500).end('500 Internal Server error, this shouldnt happen');
			var prods = JSON.parse(JSON.stringify(match));
			res.render('products', {
				title: 'TheShop - All Products',
				prods: prods
			});
		});
	},
	
	getProdSort: async function(req, res) {
		var prods;
		if (req.url.split('/')[2].substring(4) === 'price')
			prods = await prodModel.find({}).sort('price');
		else if (req.url.split('/')[2].substring(4) === 'qty')
			prods = await prodModel.find({}).sort('qty');
		else prods = await prodModel.find({}).sort('code');
		
		res.render('products', {
			title: 'TheShop - All Products',
			prods: JSON.parse(JSON.stringify(prods))
		});
	},
	
	getSearchPName: function(req, res) {
		let query = new RegExp(req.query.sQuery, 'gi');
		// use regex to make search queries much easier
		// flags: g=global, i=ignorecase
		
		// generate a new collection whose name match the search query
		prodModel.aggregate([{ '$match': {name: query} }], function(err, match) {
			if (err) return res.status(500).end('500 Internal Server error, this shouldnt happen');
			var prods = JSON.parse(JSON.stringify(match));
			// mongodb returns something similar to json, but not really. this converts it to a js object
			res.render('products', {
				title: 'TheShop - Search Results',
				prods: prods
			});
		});
	},
	
	getSearchCat: function(req, res) {
		let categ = getCateg(req.url.substring(10));
		// chop off the "/category/" part in the URL, then convert it with getCateg()
		// search records that contain the category in the category[]
		prodModel.find({"category": categ}, function(err, match) {
			if (err) return res.status(500).end('500 Internal Server error, this shouldnt happen');
			var prods = JSON.parse(JSON.stringify(match));
			res.render('products', {
				title: 'TheShop - Category',
				prods: prods
			});
		});
	},
	
	getProdPage: function(req, res) {
		// chop off again the /product/
		prodModel.findOne({code: req.url.substring(10)}, function(err, match) {
			if (err) return res.status(500).end('500 Internal Server error, this shouldnt happen');
			// pp === product details
			let pp = JSON.parse(JSON.stringify(match));
			
			res.render('prodpage', {
				title: 'TheShop - ' + pp.code,
				p: pp
			});
		});
	},
	
	getOrders: async function(req, res) {
		if (req.session.logUser) {
			let aggrPipelines = [
				{'$lookup': {
					'from': 'Users',
					'localField': 'buyer',
					'foreignField': '_id',
					'as': 'buyer'
				}},
				{'$match': {
					'buyer.email': req.session.logUser.email
				}},
				{'$lookup': {
					'from': 'Products',
					'localField': 'products.item',
					'foreignField': '_id',
					'as': 'prods'
				}}
			];
			
			try {
				var ords = await ordModel.aggregate(aggrPipelines);
				
				ords.forEach(function(ordElem) {
					for (var i = 0; i < ordElem.prods.length; i++)
						ordElem.prods[i].prodQty = ordElem.products[i].prodQty;
				});
				
				res.render('orders', {
					title: 'TheShop - My Orders',
					orders: ords
				});
			} catch (e) {
				console.log(e);
			}
		} else res.redirect("/");
	},
	
	getWishlist: async function(req, res) {
		if (req.session.logUser) {
			try {
				var user = await userModel.findOne({email: req.session.logUser.email}).populate('wishlist');
				res.render('wishlist', {
					title: 'TheShop - My Wishlist',
					wishlist: JSON.parse(JSON.stringify(user.wishlist))
				});
			} catch (e) {
				console.log(e);
			}
		} else res.redirect("/");
	},
	
	getCart: async function(req, res) {
		if (req.session.logUser) {
			try {
				var user = await userModel.findOne({email: req.session.logUser.email}).populate('cart.item');
				res.render('cart', {
					title: 'TheShop - My Cart',
					cart: JSON.parse(JSON.stringify(user.cart))
				});
			} catch (e) {
				console.log(e);
			}
		} else res.redirect("/");
	},
	
	/*
	 * POST METHODS
	 */
	
	postStats: function(req, res) {
		let { month, year } = req.body;
		res.render('stats', {
			title: 'TheShop - My Stats',
			month: month,
			year: year
		});
	},
	
	postLogin: async function(req, res) {
		let { user, pass } = req.body;
		try {
			let user = await userModel.findOne({ user: user });
			if (user) {
				bcrypt.compare(pass, user.pass, function(err, result) {
					if (result) {
						req.session.logUser = user;
						res.send({status: 200});
					} else res.send({status: 401});
				});
			}
		} catch (e) {
			res.send({status: 500, msg: e});
		}
	},
	
	postLogout: function(req, res) {
		req.session.destroy();
		res.redirect("/");
	},
	
	postReg: async function(req, res, next) {
		let { fname, lname, username, email, password, address, phone } = req.body;
		
		var hash = await bcrypt.hash(password, saltRounds);
		var otp = randtoken.generate(8);
		var insertUser = new User(fname, lname, email, username, hash, phone, address, otp);
		
		userModel.create(insertUser, function(err) {
			if (err) res.send({status: 500, msg: 'Server error, could not add user.'});
			else {
				sendConfEmail(email, fname, otp);
				res.send({status: 200, msg: 'Success!'});
			}
		});
	},
	
	postChangePW: async function(req, res) {
		let { oldpass, newpass } = req.body;
		
		// search entries with registered, then set them to newpass
		var user = await userModel.findOne({email: req.session.logUser.email});
		var comp = await bcrypt.compare(oldpass, user.pass);
		var newHash = await bcrypt.hash(newpass, saltRounds);

		if (comp) {
			// now replace the password with new hashed
			userModel.findOneAndUpdate({email: req.session.logUser.email},
					{ $set:{pass: newHash} }, {useFindAndModify: false},
					function(err, match) {
				if (err) res.send({status: 500, msg: 'Server error, please try again later.'});
				else if (!match) res.send({status: 401, msg: 'No user found.'});
				else res.send({status: 200});
			});
		} else res.send({status: 401, msg: 'Wrong old password.'});
	},
	
	postConfirm: function(req, res) {
		userModel.findOneAndUpdate({email: req.session.logUser.email}, {$set: {isConfirmed: true}}, {useFindAndModify: false},
				function(e) {
			if (e) res.send({status: 500, msg: "Server error, please try again later."});
			else res.send({status: 200, msg: 'Confirmed!'});
		});
	},
	
	/* Both postAddCart and postAddWish function exactly the same way, with the exception
	 * of what array gets updated. Here's the algo:
	 * 1. Get the product ID through req.params.id
	 * 2. Check if there's a user logged in
	 * 3. If there's a user logged in, assume product exists and get Product object
	 * 4. Assume user also exists and append to array of choice
	 */
	postAddCart: async function(req, res) {
		if (req.session.logUser) {
			try {
				var prod = await prodModel.findOne({code: req.params.id});
				console.log(JSON.parse(JSON.stringify(prod)));
				userModel.findOneAndUpdate({email: req.session.logUser.email},
						{$push: {cart: {item: prod, prodQty: prod.qty}}},
						{useFindAndModify: false}, function(err) {
					if (err) res.status(500).end('500, db err');
					else res.redirect("/products");
				});
			} catch (e) {
				console.log(e);
			}
		} else res.redirect("/");
	},
	
	postAddWish: function(req, res) {
		if (req.session.logUser) {
			prodModel.findOne({code: req.params.id}, function(err, match) {
				if (err) res.status(500).end('500, db err');
				else {
					userModel.findOneAndUpdate({email: req.session.logUser.email},
							{$push: {wishlist: match}},
							{useFindAndModify: false}, function(err) {
						if (err) res.status(500).end('500, db err');
						res.redirect("/products");
					});
				}
			});
		} else res.redirect("/");
	},
	
	/* CHECK OUT SEQUENCE
	 * 1. update prodModel quantity
	 * 2. store prod:_id and prod:buyQty in buyCart
	 * 3. pull item from userModel cart
	 * 4. make new Order object
	 */
	postCheckOut: async function(req, res) {
		let pCodes = Object.keys(req.body); // array of product codes to buy
		var buyCart = [];
		var emailO = {email: req.session.logUser.email};
		
		try {
			if (req.session.logUser) {
				var buyer = await userModel.findOne(emailO).populate('cart.item');
				
				pCodes.forEach(async function(e) {
					// get item from user's cart
					let cartItem = buyer.cart.find(function(cartElem) {
						return cartElem.item.code === e;
					});
					
					// #2
					buyCart.push({item: cartItem.item._id, prodQty: cartItem.prodQty});
					
					// #3
					await userModel.findOneAndUpdate(emailO, {'$pull': {cart: cartItem}},
							{useFindAndModify: false, 'new': true});
					
					// #1
					await prodModel.findOneAndUpdate({code: e}, {"$inc": {qty: -cartItem.prodQty}},
							{useFindAndModify: false, 'new': true});
				});
				
				// #4
				ordModel.create(new Order(buyer._id, buyCart), function(err) {
					if (err) return res.status(500).end('500, ?????????');
					res.sendStatus(200);
				});
			} else res.status(401).end('401, how the heck are you seeing this???');
		} catch(e) {
			console.log(e);
		}
	},
	
	postDelCartItem: async function(req, res) {
		try {
			let {code} = req.body;
			let emailO = {email: req.session.logUser.email};
			var user = await userModel.findOne(emailO).populate('cart.item');

			// find the cart item
			var cartItem = user.cart.find(function(cartElem) {
				return cartElem.item.code === code;
			});

			// remove from cart, TRUE means successful removal
			await userModel.findOneAndUpdate(emailO, {'$pull': {cart: cartItem}},
					{useFindAndModify: false, 'new': true}, function(err, doc) {
				if (err) {
					console.log(err);
					res.send(false);
				} else res.send(true);
			});
		} catch (e) {
			console.log(e);
		}
	},
	
	postDelWishItem: async function(req, res) {
		try {
			let {code} = req.body;
			let emailO = {email: req.session.logUser.email};
			var user = await userModel.findOne(emailO).populate('wishlist');

			// find the wishlist item
			var wishItem = user.wishlist.find(function(wishElem) {
				return wishElem.code === code;
			});

			// remove from wishlist, TRUE means successful removal
			await userModel.findOneAndUpdate(emailO, {'$pull': {wishlist: wishItem}},
					{useFindAndModify: false, 'new': true}, function(err, doc) {
				if (err) {
					console.log(err);
					res.send(false);
				} else res.send(true);
			});
		} catch (e) {
			console.log(e);
		}
	},
	
	/*
	 * PUT METHODS
	 */
	
	putUpdateCart: function(req, res) {
		try {
			req.body.forEach(async function(elem) {
				var prod = await prodModel.findOne({code: elem.code});
				userModel.updateOne({email: req.session.logUser.email, 'cart.item': prod._id},
						{$set: {'cart.$.prodQty': elem.qty}}, function(e, m) {  });
			});
			res.sendStatus(303);
		} catch (e) {
			console.log(e);
			res.redirect('/');
		}
	}
};

module.exports = indexFunctions;
