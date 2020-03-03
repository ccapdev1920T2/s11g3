// Simple skeletion for running a web app

const express = require('express'); // get the express module

const app = express();
const PORT = 8000; // set a port to listen

// req => request, res => response, next => next function to run
app.get('/', function(req, res, next) { // when the user
    res.end('Hello World!'); // renders this text on the web page
});

app.listen(8000, () => {
	console.log("hello");
    console.log(`Listening to port ${PORT}`); // once the app is running, this will be logged
});