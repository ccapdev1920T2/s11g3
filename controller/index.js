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

const indexFunctions = {
	getHome: function(req, res, next) {
		console.log(req.session);
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
	
	getAsdf: function(req, res, next) {
		res.send('Asdf Directory');
	},
	
	// Add this
	getLogin: function(req, res, next) {
		res.render('login', { // just render login.hbs
			title: 'Login'
		});
	},
	
	postLogin: function(req, res, next) {
		req.session.destroy();
		console.log(req.body); // data from the form is stored, gets element's names from passed form
		let { email, password } = req.body;
		var matchUser = userList.filter(findUser(email, password));
		
		if (matchUser.length === 1) {
			console.log('hello');
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
	
	initLists: function(req, res, next) {
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
		next();
	}
};

module.exports = indexFunctions;