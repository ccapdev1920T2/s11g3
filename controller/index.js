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
		if (res.session.logUser) {
			res.render('home', {
				name: res.session.logUser.fName + " " + res.session.logUser.lName
			});
		} else {
			res.render('home', {
				name: "Unknown"
			});
		}
	},
	
	getLogin: function(req, res, next) {
		console.log(res.session.logUser);
		if (res.session.logUser.email) { // check if there's a user logged in
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
			user: res.session.logUser.user,
			fName: res.session.logUser.fName,
			lName: res.session.logUser.lName,
			email: res.session.logUser.email,
			addr: res.session.logUser.addr,
			contact: res.session.logUser.contact
		});
	},
	
	getRegister: function(req, res, next) {
		res.render('registration');
	},
	
	getChangePW: function(req, res, next) {
		res.render('changepass');
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
			res.session.logUser = match;
			
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
		let { fname, lname, username, email, password, address, phone } = req.body;
		
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
		let { oldpass, newpass } = req.body;
		
		userModel.findOneAndUpdate({pass: oldpass}, { $set:{pass: newpass} }, {useFindAndModify: false}, function(err, match) {
			if (err) return res.status(500).end('500 internal error, this shouldnt happen wtf');
			if (!match) return res.status(401).end('401, password forbidden');
			
			console.log(match);
		});
		
		res.redirect('/');
	}
};

module.exports = indexFunctions;
