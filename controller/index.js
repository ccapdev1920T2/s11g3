const userModel = require('../model/userdb');
const prodModel = require('../model/productdb');

// placeholder local storage (hacky db)
const userList = [];
const itemList = [];

function User(fName, lName, email, user, pass, contact, addr) {
	this.fName = fName;
	this.lName = lName;
	this.email = email;
	this.user = user;
	this.pass = pass;
	this.contact = contact;
	this.addr = addr;
}

function Product(name, code, desc, price, qty, size, category) {
	this.name = name;
	this.code = code;
	this.desc = desc;
	this.price = price;
	this.qty = qty;
	this.size = size;
	this.category = category;
}

function findUser(email, pass) {
	return function(elem) {
		return elem.email === email && elem.pass === pass;
	};
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
	
	postLogout: function(req, res, next) {
		req.session.destroy();
		res.redirect("/login");
	},
	
//	postRegister: function(req, res, next) {
//		const { fname, lname, username, email, password, password_conf, address, phone, checkbox } = req.body;
//		if (userList.filter(function(elem) {
//			return elem.email === email;
//		})) {
//			console.log("reg success");
//			userList.push(new User(fname, lname, email, username, password, phone, address));
//			res.redirect('/');
//		}
//	},
	
	// populates local storage with sample data, will occur only once so as not to have any duplicate records
	initLists: function(req, res, next) {
		if (userList.length === 0) {
			userList.push(new User("Matthew Neal",
					"Lim",
					"matthew_neal@gmail.com",
					"neallithic",
					"myPass1",
					"09171111111",
					"123 Power Drive, Manila City"));
			userList.push(new User("Shannon Gail",
					"Ho",
					"shaanon_ho@yahoo.com",
					"shannyHoHoHo",
					"myPass2",
					"09172222222",
					"123 Power Drive, Manila City"));
			userList.push(new User("Julia Patricia",
					"Estella",
					"julia_patr@gmail.com",
					"hoolyuh",
					"myPass3",
					"09173333333",
					"123 Power Drive, Manila City"));
			userList.push(new User("Arren Cappuccino",
					"Antioquia",
					"arren_cappu@yahoo.com",
					"arvention",
					"myPass4",
					"09174444444",
					"123 Power Drive, Manila City"));
			userList.push(new User("John",
					"Doe",
					"hello@testing.com",
					"someUsername",
					"myPass5",
					"09175555555",
					"123 Power Drive, Manila City"));
		}

		if (itemList.length === 0) {
			itemList.push(new Product("Pink Dress - S",
					"WC0001",
					"This is a pink dress",
					1000.10,
					10,
					"S",
					"Women's Clothes"));
			itemList.push(new Product("Toddler's Jumper - M",
					"KI0001",
					"This is a toddler's jumper",
					400.55,
					2,
					"M",
					"Kids"));
			itemList.push(new Product("Gold Necklace",
					"WA0001",
					"This is a gold necklace",
					20.00,
					254,
					"S",
					"Women's Accessories"));
			itemList.push(new Product("Red Stilettos",
					"WS0001",
					"These are red stilettos",
					500.99,
					30,
					"S",
					"Women's Shoes"));
			itemList.push(new Product("Gray Tuxedo - L",
					"ME0001",
					"This is a gray tuxedo",
					1566.00,
					5,
					"L",
					"Men's"));
		}
		res.redirect("/");
	},
	
	/* draft implementation of POST methods using mongoose. i realise that you probalby
	 * have to make use of async and await here, but... sigh.
	 */
	postLoginDB: function(req, res, next) {
		let { email, password } = req.body;
		userModel.findOne({ email: email, pass: password }, function (err, match) {
			console.table(match);
			if (err) return res.status(500).end('500 Internal Server error, something bad happened');
			if (!match) return res.status(401).end('401 Unauthorized error, no user found!');
			
			// must return only one matched user. otherwise, no match found
			req.session.user = match[0].user;
			req.session.fName = match[0].fName;
			req.session.lName = match[0].lName;
			req.session.email = match[0].email;
			req.session.addr = match[0].addr;
			req.session.contact = match[0].contact;
			
			return res.status(200).render('account', {
				user: match[0].user,
				fName: match[0].fName,
				lName: match[0].lName,
				email: match[0].email,
				addr: match[0].addr,
				contact: match[0].contact
			});
		});
	},
	
	postRegDB: function(req, res, next) {
		const { fname, lname, username, email, password, password_conf, address, phone, checkbox } = req.body;
		
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
	}
};

module.exports = indexFunctions;
