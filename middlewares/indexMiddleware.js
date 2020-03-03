function isEmail(email) {
	let regex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
	return regex.test(email);
}

const indexMiddleware = {
	validateLogin: function(req, res, next) {
		const { email, password } = req.body;
		
		if (!email) { // check if empty
			return res.status(401).end('401 Unauthorized error, no email'); // 401 Unauthorized error, wrong credential
		} else if (!isEmail(email)) { // check if it is a valid email
			return res.status(401).end('401 Unauthorized error, not an email');
		}
		
		if (!password)
			return res.status(401).end('401 Unauthorized error, no password');
		
		next(); // calls the next function
	}
};

module.exports = indexMiddleware;