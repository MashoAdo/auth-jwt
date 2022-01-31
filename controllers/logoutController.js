const dbUsers = {
	users: require("../model/users"),
	setUsers: function (data) {
		this.users = data;
	},
};

const fsPromises = require("fs/promises");
const path = require("path");

const logoutHandle = async (req, res) => {
	const cookies = req.cookies;

	if (!cookies?.jwt) res.sendStatus(401); //unauthorized

	const refreshToken = cookies.jwt;

	const foundeUser = dbUsers.users.find(
		(person) => person.refreshToken === refreshToken
	);

	if (!foundeUser) {
		res.clearCookie("jwt", { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
		res.sendStatus(204);
	} //

	const otherUsers = dbUsers.users.filter(
		(person) => person.username !== refreshToken
	);
	const currentUserWithoutRefreshToken = { ...foundeUser, refreshToken: "" };

	dbUsers.setUsers([...otherUsers, currentUserWithoutRefreshToken]);

	await fsPromises.writeFile(
		path.join(__dirname, "..", "model", "users.json"),
		JSON.stringify(dbUsers.users)
	);

	// maxAge not necessary
	res.clearCookie("jwt", { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
	res.sendStatus(204);
};

module.exports = logoutHandle;
