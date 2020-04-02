/* Accessing the models (db) of each class
 */
const userModel = require('../model/userdb');
const prodModel = require('../model/productdb');
const ordModel = require('../model/orderdb');

/* Object constructors */
function User(fName, lName, email, user, pass, contact, addr) {
	this.fName = fName;
	this.lName = lName;
	this.email = email;
	this.user = user;
	this.pass = pass;
	this.contact = contact;
	this.addr = addr;
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
		case 'kids': return "Kid's";
		case 'waccessories': return "Women's Accessories";
		case 'wclothes': return "Women's Clothes";
		case 'wshoes': return "Women's Shoes";
	}
}

/** Indexian of functions used for app functions
 */
const indexFunctions = {
	getHome: function(req, res) {
		if (req.session.logUser) { // check if there's a logged in user
			res.render('home', {
				title: 'TheShop',
				name: req.session.logUser.fName + " " + req.session.logUser.lName
			});
		} else {
			res.render('home', {
				title: 'TheShop',
				name: "Unknown" // display "unknown" if no user logged in
			});
		}
	},
	
	getLogin: function(req, res) {
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
			// idk yet huehue
			title: 'TheShop - My Stats'
		});
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
		} else res.status(403).end('403 forbidden, please log in');
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
			if (!match) return res.status(500).end('500, no products found');
			
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
					'as': 'products.item'
				}}
			];
			
			try {
				var ords = await ordModel.aggregate(aggrPipelines);
				
				console.log(ords[0]); console.log('\n');
				// let details = classes.map((item, i) => Object.assign({}, item, classes[i].courseId));
				console.log(ords[0]);  console.log('\n');
				
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
	
	postStats: function(req, res) {
		let { month, year } = req.body;
		res.render('stats', {
			title: 'TheShop - My Stats',
			month: month,
			year: year
		});
	},
	
	postLogin: function(req, res) {
		let { email, password } = req.body;
		userModel.findOne({ email: email, pass: password }, function (err, match) {
			if (err) return res.status(500).end('500 Internal Server error, something bad happened');
			if (!match) return res.status(401).end('401 Unauthorized error, no user found!');
			
			// if no match found, return 401 error
			req.session.logUser = match;
			
			return res.status(200).render('account', {
				title: 'TheShop - My Acount',
				user: match.user,
				fName: match.fName,
				lName: match.lName,
				email: match.email,
				addr: match.addr,
				contact: match.contact
			});
		});
	},
	
	postLogout: function(req, res) {
		req.session.destroy();
		res.redirect("/");
	},
	
	postReg: function(req, res, next) {
		let { fname, lname, username, email, password, address, phone } = req.body;
		
		userModel.find({email: email}, function(err, match) {
			if (err) return res.status(500).end('500 Internal Server error, this shouldnt happen');
			if (match.length !== 0) { // check if email already exists in db
				return res.status(401).end('401 Unauth error, user already exists');
			}
			
			// insert user in db if reg is successful
			var insertUser = new User(fname, lname, email, username, password, phone, address);
			userModel.create(insertUser, function(err) {
				if (err) return res.status(500).end('500 Internal Server error, cant register');
				res.redirect('/');
			});
		});
	},
	
	postChangePW: function(req, res) {
		let { oldpass, newpass } = req.body;
		
		// search entries with oldpass, then set them to newpass
		userModel.findOneAndUpdate({pass: oldpass}, { $set:{pass: newpass} }, {useFindAndModify: false}, function(err, match) {
			if (err) return res.status(500).end('500 internal error, this shouldnt happen wtf');
			if (!match) return res.status(401).end('401, password forbidden');
		});
		
		res.redirect('/');
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
				console.log('\nAWAIT PROD\n' + JSON.parse(JSON.stringify(prod)) + '\n');
			} catch (e) {
				console.log(e);
			}
			
			prodModel.findOne({code: req.params.id}, function(err, match) {
				if (err) res.status(500).end('500, db err');
				else {
					userModel.findOneAndUpdate({email: req.session.logUser.email},
							{$push: {cart: {item: match, prodQty: match.qty}}},
							{useFindAndModify: false}, function(err) {
						if (err) res.status(500).end('500, db err');
						res.redirect("/products");
					});
				}
			});
		} else res.redirect("/product/" + req.params.id);
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
		} else res.redirect("/product/" + req.params.id);
	},
	
	putUpdateCart: function(req, res) {
		req.body.forEach(async function(elem) {
			var prod = await prodModel.findOne({code: elem.code});
			userModel.updateOne({email: req.session.logUser.email, 'cart.item': prod._id},
					{$set: {'cart.$.prodQty': elem.qty}});
		});
		res.status(200);
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
					
					// #1
					await prodModel.findOneAndUpdate({code: e}, {"$inc": {qty: -cartItem.prodQty}},
							{useFindAndModify: false, 'new': true}, function(err, doc) {
						console.log(doc);
					});
					
					// #3
					await userModel.findOneAndUpdate(emailO, {'$pull': {cart: cartItem}},
							{useFindAndModify: false, 'new': true}, function(err, doc) {
						console.log(doc);
					});
				});
				
//				console.log(buyCart);
				
				// #4
//				console.log(new Order(buyer._id, buyCart));
				ordModel.create(new Order(buyer._id, buyCart), function(err) {
					if (err) return res.status(500).end('500, ?????????');
					res.redirect("/cart");
				});
			} else res.status(401).end('401, how the heck are you seeing this???');
		} catch(e) {
			console.log(e);
		}
	}
};

module.exports = indexFunctions;
