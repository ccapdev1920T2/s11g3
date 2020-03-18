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

const indexFunctions = {
	getHome: function(req, res, next) {
		if (req.session.email) {
			res.render('home', {
				name: req.session.fName + " " + req.session.lName
			});
		} else {
			res.render('home', {
				name: "Unknown"
			});
		}
	},
	
	getLogin: function(req, res, next) {
		console.log(req.session.email);
		if (req.session.email) { // check if there's a user logged in
			res.redirect('/'); // go back to home
		} else {
			res.render('login', { // just renders login.hbs
				title: 'Login'
			});
		}
	},
	
	getStats: function(req, res, next) {
		res.render('stats', {
			// idk yet huehue
		});
	},
	
	getAccount: function(req, res, next) {
		res.render('account', {
			user: req.session.user,
			fName: req.session.fName,
			lName: req.session.lName,
			email: req.session.email,
			addr: req.session.addr,
			contact: req.session.contact
		});
	},
	
	getRegister: function(req, res, next) {
		res.render('registration');
	},
	
	postStats: function(req, res, next) {
		let { month, year } = req.body;
		res.render('stats', {
			month: month,
			year: year
		});
	},
	
	postLogin: function(req, res, next) {
		let { email, password } = req.body;
		userModel.findOne({ email: email, pass: password }, function (err, match) {
			console.log(match);
			if (err) return res.status(500).end('500 Internal Server error, something bad happened');
			if (!match) return res.status(401).end('401 Unauthorized error, no user found!');
			
			// must return only one matched user. otherwise, no match found
			req.session.user = match.user;
			req.session.fName = match.fName;
			req.session.lName = match.lName;
			req.session.email = match.email;
			req.session.addr = match.addr;
			req.session.contact = match.contact;
			
			return res.status(200).render('account', {
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
		let { fname, lname, username, email, password, address, phone, checkbox } = req.body;
		
		userModel.find({email: email}, function(err, match) {
			if (err) return res.status(500).end('500 Internal Server error, this shouldnt happen');
			if (match.length !== 0) {
				console.log(match);
				return res.status(401).end('401 Unauth error, user already exists');
			}
			
			var insertUser = new User(fname, lname, email, username, password, phone, address);
			userModel.create(insertUser, function(err) {
				if (err) return res.status(500).end('500 Internal Server error, cant register');
				console.log("reg success");
				res.redirect('/');
			});
		});
	},
	
	postChangePW: function(req, res, next) {
		
	}
};

module.exports = indexFunctions;
