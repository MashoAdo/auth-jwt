const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
	const authHeader = req.headers.authorization || req.headers.Authorization;

	if (!authHeader?.startsWith("Bearer ")) res.sendStatus(401);

	// console.log(authHeader);

	const token = authHeader.split(" ")[1];

	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decode) => {
		if (err) res.sendStatus(403);
		console.log(decode);
		req.user = decode.userInfo.username;
		req.roles = decode.userInfo.roles;
		next();
	});
};

module.exports = verifyJWT;
