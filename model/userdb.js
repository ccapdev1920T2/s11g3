const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/TheShop', {useNewUrlParser: true, useUnifiedTopology: true})
		.then(() => { console.log('connect done: user'); },
		err => { console.log('theres problems');
});
var db = mongoose.connection;

var userSchema = new mongoose.Schema({
	fName: String,
	lName: String,
	user: String,
	pass: String,
	email: String,
	addr: String,
	contact: Number
}, {collection: "Users"});

const userModel = db.model('Users', userSchema);

module.exports = userModel;
