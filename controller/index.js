// placeholder local storage (hacky db)
const userList = [];
const itemList = [];

function mkUser(fName, lName, email, pass, contact, addr) {
	var tempUser = {
		fName: fName,
		lName: lName,
		email: email,
		pass: pass,
		contact: contact,
		addr: addr
	};
	return tempUser;
}
function mkProduct(name, code, desc, price, qty, size, category) {
	var tempProd = {
		name: name,
		code: code,
		desc: desc,
		price: price,
		qty: qty,
		size: size,
		category: category
	};
	return tempProd;
}

function findUser(email, pass) {
	return function(elem) {
		return elem.email === email && elem.pass === pass;
	};
}

function findEmail(email) {
	return function(elem) {
		return elem.email === email;
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
			fName: req.session.fName,
			lName: req.session.lName,
			email: req.session.email,
			addr: req.session.addr,
			contact: req.session.contact
		});
	},
	
	getRegister: function(req, res, next) {
		res.render('registration', {
			// idk
		});
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
	
	/** to refactor: move the callback into filter as anonymous function
	 */
	postLogin: function(req, res, next) {
		console.log(req.body); // data from the form is stored
		let { email, password } = req.body;
		// temp array containing all matches from the "db" to the login input
		var matchUser = userList.filter(findUser(email, password));
		
		console.log("matchUser contents: ", matchUser);
		
		if (matchUser.length === 1) { // must return only one matched user. otherwise, no match found
			req.session.fName = matchUser[0].fName;
			req.session.lName = matchUser[0].lName;
			req.session.email = matchUser[0].email;
			req.session.addr = matchUser[0].addr;
			req.session.contact = matchUser[0].contact;
			
			// something's supposed to happen here
			
			return res.status(200).render('account', {
				fName: matchUser[0].fName,
				lName: matchUser[0].lName,
				email: matchUser[0].email,
				addr: matchUser[0].addr,
				contact: matchUser[0].contact
			});
		} else {
			return res.status(401).end('401 Unauthorized error, no user found!');
		}
	},
	
	postRegister: function(req, res, next) {
		const { fname, lname, username, email, password, password_conf, address, phone, checkbox } = req.body;
		if (userList.filter(function(elem) {
			return elem.email === email;
		})) {
			console.log("reg success");
			userList.push(mkUser(fname, lname, email, password, phone, address));
			res.redirect('/');
		}
	},
	
	// populates local storage with sample data, will occur only once so as not to have any duplicate records
	initLists: function(req, res, next) {
		if (userList.length === 0) {
			userList.push(mkUser("Matthew Neal",
					"Lim",
					"matthew_neal@gmail.com",
					"myPass1",
					"09171111111",
					"123 Power Drive, Manila City"));
			userList.push(mkUser("Shannon Gail",
					"Ho",
					"shaanon_ho@yahoo.com",
					"myPass2",
					"09172222222",
					"123 Power Drive, Manila City"));
			userList.push(mkUser("Julia Patricia",
					"Estella",
					"julia_patr@gmail.com",
					"myPass3",
					"09173333333",
					"123 Power Drive, Manila City"));
			userList.push(mkUser("Arren Cappuccino",
					"Antioquia",
					"arren_cappu@yahoo.com",
					"myPass4",
					"09174444444",
					"123 Power Drive, Manila City"));
			userList.push(mkUser("John",
					"Doe",
					"hello@testing.com",
					"myPass5",
					"09175555555",
					"123 Power Drive, Manila City"));
		}

		if (itemList.length === 0) {
			itemList.push(mkProduct("Pink Dress - S",
					"WC0001",
					"This is a pink dress",
					1000.10,
					10,
					"S",
					"Women's Clothes"));
			itemList.push(mkProduct("Toddler's Jumper - M",
					"KI0001",
					"This is a toddler's jumper",
					400.55,
					2,
					"M",
					"Kids"));
			itemList.push(mkProduct("Gold Necklace",
					"WA0001",
					"This is a gold necklace",
					20.00,
					254,
					"S",
					"Women's Accessories"));
			itemList.push(mkProduct("Red Stilettos",
					"WS0001",
					"These are red stilettos",
					500.99,
					30,
					"S",
					"Women's Shoes"));
			itemList.push(mkProduct("Gray Tuxedo - L",
					"ME0001",
					"This is a gray tuxedo",
					1566.00,
					5,
					"L",
					"Men's"));
		}
		res.redirect("/");
	}
};

module.exports = indexFunctions;
