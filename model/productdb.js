const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/TheShop', {useNewUrlParser: true, useUnifiedTopology: true})
		.then(() => { console.log('prod'); },
		err => { console.log('theres problems');
});
var db = mongoose.connection;

var prodSchema = new mongoose.Schema({
	name: String,
	code: String,
	desc: String,
	price: Number,
	qty: Number,
	size: String,
	filename: String,
	category: [String]
}, {collection: "Products"});

const prodModel = db.model('Products', prodSchema);

module.exports = prodModel;
