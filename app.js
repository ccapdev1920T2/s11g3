const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// Making a session with a given key
app.use(cookieParser());
app.use(session({
	secret: "Secret key",
	name: "cookie",
	resave: true,
	saveUninitialized: true
}));

// Initialize the view
app.use(express.static(__dirname + '/'));
app.set('views', path.join(__dirname, 'views/'));
app.engine('hbs', exphbs.create({
	extname: 'hbs',
	defaultLayout: 'main',
	partialsDir: 'views/partials',
	layoutsDir: 'views/layouts',
	helpers: {
		getPImg: function(filename) {
			return '../assets/img/' + filename;
		},
		getPLink: function(code, linktype) {
			/* link types:
			 * 1: product page
			 * 2: add to cart
			 * 3: wishlist
			 */
			switch (linktype) {
				case 1: return '/products/' + code;
				case 2: return '/addtocart/' + code;
				case 3: return '/wishlist/' + code;
			}
		},
		getSize: function(size) {
			switch(size) {
				case 'S': return "Small";
				case 'M': return "Medium";
				case 'L': return "Large";
			}
		},
		getPrice: function(price) {
			return price.toFixed(2);
		},
		getPriceTotal: function(cart) {
			return cart.reduce(function(total, item) {
				return total + item.price * item.qty;
			}, 0.00).toFixed(2);
		},
		getQtyTotal: function(cart) {
			return cart.reduce(function(total, item) {
				return total + item.qty;
			}, 0);
		},
		stringifyDate: function(mili) {
			return new Date(mili).toISOString().substring(0, 10);
		},
		getOrdPrice: function(prods) {
			var price = prods.reduce(function(a, b) {
				return a + (b.prodQty * b.price);
			}, 0.0);
			return price.toFixed(2);
		},
		getOrdQty: function(prods) {
			var qty = prods.reduce(function(a, b) {
				return a + b.prodQty;
			}, 0);
			return qty;
		},
		getOrdCode: function(objID) {
			return objID.toString().substring(4);
		},
		getOrdHeadClass: function(ordStatus) {
			switch(ordStatus) {
				case 'PROCESSING': return "order-header-processing";
				case 'COMPLETE': return "order-header-complete";
				case 'CANCELLED': return "order-header-cancelled";
			}
		},
		categToString: function(cats) {
			return cats.join(', ');
		}
	}
}).engine);
app.set('view engine', 'hbs');

// MIDDLEWARES => functions that run before we execute the control functions
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ROUTERS
const indexRouter = require('./router/indexRouter');
app.use('/', indexRouter);

// handling 404 requests
app.get('*', function(req, res) {
	res.render('error', {
		title: 'The Shop - 404 Error'
	});
});

// log this in console when ran
app.listen(3000, () => {
	console.log(`Listening to localhost on port ${PORT}`);
});
