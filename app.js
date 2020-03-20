const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// Starting db for... something
//mongoose.connect('mongodb://localhost/TheShop', {useNewUrlParser: true, useUnifiedTopology: true})
//		.then(() => { console.log('cool'); },
//		err => { console.log('theres problems');
//});
//var db = mongoose.connection;

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

		getPLink: function(code) {
			return '/products/' + code;
		},
		
		getSize: function(size) {
			switch(size) {
				case 'S': return "Small";
				case 'M': return "Medium";
				case 'L': return "Large";
			}
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

// handling 404 errors
app.get('*', function(req, res, next) {
	res.status(404).end('404 Not Found');
});

// log this in console when ran
app.listen(3000, () => {
	console.log(`Listening to localhost on port ${PORT}`);
});
