function isEmail(email) {
	let regex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
	return regex.test(email);
}

const indexMiddleware = {
	validateLogin: function(req, res, next) {
		const { email, password } = req.body;
		
		if (!email) { // check if empty
			return res.status(401).end('401 Unauthorized error, no email');
		} else if (!isEmail(email)) { // check if it is a valid email
			return res.status(401).end('401 Unauthorized error, not an email');
		}
		
		if (!password)
			return res.status(401).end('401 Unauthorized error, no password');
		
		next(); // calls the next function
	},
	
	validateReg: function(req, res, next) {
		const { fname, lname, username, email, password, password_conf, address, phone, checkbox } = req.body;
		if (!fname || !lname || !username || !email || !password || !password_conf || !address || !phone || !checkbox)
			return res.status(401).end('401, missing credentials');
		else if (!isEmail(email))
			return res.status(401).end('401, bad email');
		else if (password !== password_conf)
			return res.status(401).end('401, bad pass/conf');
		else next();
	}
};

module.exports = indexMiddleware;
