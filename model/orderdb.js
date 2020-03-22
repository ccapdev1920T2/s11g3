const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/TheShop', {useNewUrlParser: true, useUnifiedTopology: true})
		.then(() => { console.log('ords'); },
		err => { console.log('theres problems');
});
var db = mongoose.connection;

var ordSchema = new mongoose.Schema({
	dateOrd: { type: Date, default: Date.now },
	status: String,
	buyer: {type: mongoose.Schema.Types.ObjectId, ref: 'Users'},
	products: [{type: mongoose.Schema.Types.ObjectId, ref: 'Products'}]
}, {collection: "Orders"});

const ordModel = db.model('Orders', ordSchema);

module.exports = ordModel;
