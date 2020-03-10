const mongoose = require('mongoose');
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

// not sure if this is needed
var userSchema = new Schema({
	fName: String,
	lName: String,
	user: String,
	pass: String,
	email: String,
	addr: String,
	contact: Number
});

var userModel = mongoose.model('Users', userSchema);

module.exports = userModel;
