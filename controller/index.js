const userModel = require('../model/userdb');
const prodModel = require('../model/productdb');
const ordModel = require('../model/orderdb');

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
function Order(dateOrd, status, buyer, products) {
	this.dateOrd = dateOrd;
	this.status = status;
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

const indexFunctions = {
	getHome: function(req, res, next) {
		if (req.session.logUser) {
			res.render('home', {
				title: 'TheShop',
				name: req.session.logUser.fName + " " + req.session.logUser.lName
			});
		} else {
			res.render('home', {
				title: 'TheShop',
				name: "Unknown"
			});
		}
	},
	
	getLogin: function(req, res, next) {
		if (req.session.logUser) { // check if there's a user logged in
			res.redirect('/'); // go back to home
		} else {
			res.render('login', { // just renders login.hbs
				title: 'TheShop - Login'
			});
		}
	},
	
	getStats: function(req, res, next) {
		res.render('stats', {
			// idk yet huehue
			title: 'TheShop - My Stats'
		});
	},
	
	getAccount: function(req, res, next) {
		res.render('account', {
			title: 'TheShop - My Acount',
			user: req.session.logUser.user,
			fName: req.session.logUser.fName,
			lName: req.session.logUser.lName,
			email: req.session.logUser.email,
			addr: req.session.logUser.addr,
			contact: req.session.logUser.contact
		});
	},
	
	getRegister: function(req, res, next) {
		res.render('registration', {
			title: 'TheShop - Registration'
		});
	},
	
	getChangePW: function(req, res, next) {
		res.render('changepass', {
			title: 'TheShop - Change Password'
		});
	},
	
	getProducts: function(req, res, next) {
		prodModel.find({}, function(err, match) {
			if (err) return res.status(500).end('500 Internal Server error, this shouldnt happen');
			if (match.length === 0) {
				return res.status(500).end('500, no products found');
			}
			var prods = JSON.parse(JSON.stringify(match));
			res.render('products', {
				title: 'TheShop - All Products',
				prods: prods
			});
		});
	},
	
	postStats: function(req, res, next) {
		let { month, year } = req.body;
		res.render('stats', {
			title: 'TheShop - My Stats',
			month: month,
			year: year
		});
	},
	
	postLogin: function(req, res, next) {
		let { email, password } = req.body;
		userModel.findOne({ email: email, pass: password }, function (err, match) {
			if (err) return res.status(500).end('500 Internal Server error, something bad happened');
			if (!match) return res.status(401).end('401 Unauthorized error, no user found!');
			
			// must return only one matched user. otherwise, no match found
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
	
	postLogout: function(req, res, next) {
		req.session.destroy();
		res.redirect("/login");
	},
	
	postReg: function(req, res, next) {
		let { fname, lname, username, email, password, address, phone } = req.body;
		
		userModel.find({email: email}, function(err, match) {
			if (err) return res.status(500).end('500 Internal Server error, this shouldnt happen');
			if (match.length !== 0) {
				return res.status(401).end('401 Unauth error, user already exists');
			}
			
			var insertUser = new User(fname, lname, email, username, password, phone, address);
			userModel.create(insertUser, function(err) {
				if (err) return res.status(500).end('500 Internal Server error, cant register');
				res.redirect('/');
			});
		});
	},
	
	postChangePW: function(req, res, next) {
		let { oldpass, newpass } = req.body;
		
		userModel.findOneAndUpdate({pass: oldpass}, { $set:{pass: newpass} }, {useFindAndModify: false}, function(err, match) {
			if (err) return res.status(500).end('500 internal error, this shouldnt happen wtf');
			if (!match) return res.status(401).end('401, password forbidden');
		});
		
		res.redirect('/');
	},
	
	getSearchPName: function(req, res, next) {
		let query = new RegExp(req.query.sQuery, 'gi');
		
		prodModel.aggregate([{ '$match': {name: query} }], function(err, match) {
			if (err) return res.status(500).end('500 Internal Server error, this shouldnt happen');
			var prods = JSON.parse(JSON.stringify(match));
			res.render('products', {
				title: 'TheShop - Search Results',
				prods: prods
			});
		});
	},
	
	getSearchCat: function(req, res, next) {
		let categ = getCateg(req.url.substring(10));
		
		prodModel.find({"category": categ}, function(err, match) {
			if (err) return res.status(500).end('500 Internal Server error, this shouldnt happen');
			if (match.length === 0) {
				return res.status(500).end('500, no products found');
			}
			var prods = JSON.parse(JSON.stringify(match));
			res.render('products', {
				title: 'TheShop - Category',
				prods: prods
			});
		});
	},
	
	getProdPage: function(req, res, next) {
		prodModel.findOne({code: req.url.substring(10)}, function(err, match) {
			if (err) return res.status(500).end('500 Internal Server error, this shouldnt happen');
			if (!match) return res.status(500).end('500, no products found');
			
			let pp = JSON.parse(JSON.stringify(match));
			
			res.render('prodpage', {
				title: 'TheShop - ' + pp.code,
				p: pp
			});
		});
	}
};

module.exports = indexFunctions;
