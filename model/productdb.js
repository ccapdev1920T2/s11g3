const mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/TheShop', {useNewUrlParser: true, useUnifiedTopology: true})
		.then(() => { console.log('cool'); },
		err => { console.log('theres problems');
});
var db = mongoose.connection;

function Product(name, code, desc, price, qty, size, category) {
	this.name = name;
	this.code = code;
	this.desc = desc;
	this.price = price;
	this.qty = qty;
	this.size = size;
	this.category = category;
}

// not sure if this is needed
var prodSchema = new Schema({
	name: String,
	code: String,
	desc: String,
	price: Number,
	qty: Number,
	size: String,
	category: [String]
});

var prodModel = db.model('Products', prodSchema);

module.exports = prodModel;
