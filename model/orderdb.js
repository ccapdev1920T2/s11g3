const mongoose = require('mongoose');
// 'mongodb://localhost/TheShop'
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@theshopcluster-nywp8.mongodb.net/TheShop?retryWrites=true&w=majority`,
		{useNewUrlParser: true, useUnifiedTopology: true})
		.then(() => { console.log('ords'); },
		err => { console.log('theres problems'); console.log(err);
});
var db = mongoose.connection;

var ordSchema = new mongoose.Schema({
	dateOrd: { type: Date, default: Date.now() },
	status: String,
	buyer: {type: mongoose.Schema.Types.ObjectId, ref: 'Users'},
	products: [{item: {type: mongoose.Schema.Types.ObjectId, ref: 'Products'}, prodQty: Number}]
}, {collection: "Orders"});

const ordModel = db.model('Orders', ordSchema);

module.exports = ordModel;
