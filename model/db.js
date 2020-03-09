const mongoose = require('mongooose');
var Schema = mongoose.Schema;

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

var userSchema = new Schema({
	fName: String,
	lName: String,
	user: String,
	pass: String,
	email: String,
	addr: String,
	contact: Number
});

var prodSchema = new Schema({
	name: String,
	code: String,
	desc: String,
	price: Number,
	qty: Number,
	size: String,
	category: [String]
});

var userModel = mongoose.model('Users', userSchema);
var prodModel = mongoose.model('Products', prodSchema);

const dbFunctions = {
	regUser: function(req, res, next) {
		if (newUser instanceof User) {
			// add user to db, idk how tho
		} else console.log('invalid insertion');
	},
	
	
};

module.exports = dbFunctions;
