const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/TheShop', {useNewUrlParser: true, useUnifiedTopology: true})
		.then(() => { console.log('connect done: prod'); },
		err => { console.log('theres problems');
});
var db = mongoose.connection;

var ordSchema = new mongoose.Schema({
	dateOrd: { type: Date, default: Date.now },
	status: String,
	buyer: User,
	products: [Product]
}, {collection: "Orders"});

const ordModel = db.model('Products', ordSchema);

module.exports = ordModel;
