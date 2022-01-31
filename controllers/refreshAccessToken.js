const dbUsers = {
	users: require("../model/users"),
	setUsers: function (data) {
		this.users = data;
	},
};

const jwt = require("jsonwebtoken");

const refreshAccessToken = (req, res, next) => {
	const cookies = req.cookies;

	if (!cookies?.jwt) res.sendStatus(401); //unauthorized

	const refreshToken = cookies.jwt;

	const foundeUser = dbUsers.users.find(
		(person) => person.refreshToken === refreshToken
	);

	if (!foundeUser) res.sendStatus(403); //forbidden

	jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decode) => {
		const roles = Object.values(userExists.roles);

		if (err || foundeUser.username !== decode.username) res.sendStatus(403);

		const accessToken = jwt.sign(
			{
				userInfo: {
					roles: roles,
					username: userExists.username,
				},
			},
			process.env.ACCESS_TOKEN_SECRET,
			{ expiresIn: "40s" } //set longer in production
		);

		res.json({ accessToken });
	});
};

module.exports = refreshAccessToken;
