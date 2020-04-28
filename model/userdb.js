const mongoose = require('mongoose');
// 'mongodb://localhost/TheShop'
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@theshopcluster-nywp8.mongodb.net/TheShop?retryWrites=true&w=majority`,
		{useNewUrlParser: true, useUnifiedTopology: true})
		.then(() => { console.log('user'); },
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
	contact: Number,
	otp: String,
	isConfirmed: Boolean,
	cart: [{item: {type: mongoose.Schema.Types.ObjectId, ref: 'Products'}, prodQty: Number}],
	wishlist: [{type: mongoose.Schema.Types.ObjectId, ref: 'Products'}]
}, {collection: "Users"});

const userModel = db.model('Users', userSchema);

module.exports = userModel;
