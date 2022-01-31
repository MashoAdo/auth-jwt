const dbUsers = {
	users: require("../model/users"),
	setUsers: function (data) {
		this.users = data;
	},
};
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fsPromises = require("fs/promises");
const path = require("path");

const loginController = async (req, res) => {
	const { username, password } = req.body;

	// check if both password and user details have been provided
	if (!username || !password)
		return res
			.status(400)
			.json({ Message: "Please enter Username and Password" });

	const userExists = dbUsers.users.find(
		(person) => person.username === username
	);

	if (!userExists) res.status(401).json({ message: "user not found" });

	const match = await bcrypt.compare(password, userExists.password);

	const roles = Object.values(userExists.roles);

	if (match) {
		// create acces and refresh tokens
		const accessToken = jwt.sign(
			{
				userInfo: {
					roles: roles,
					username: userExists.username,
				},
			},
			process.env.ACCESS_TOKEN_SECRET,
			{ expiresIn: "1d" }
		);

		const refreshToken = jwt.sign(
			{ username: userExists.username },
			process.env.REFRESH_TOKEN_SECRET,
			{ expiresIn: "1d" }
		);

		// save refresh tokens
		const otherUsers = dbUsers.users.filter(
			(person) => person.username !== userExists.username
		);
		const currentUser = { ...userExists, refreshToken };

		dbUsers.setUsers([...otherUsers, currentUser]);

		await fsPromises.writeFile(
			path.join(__dirname, "..", "model", "users.json"),
			JSON.stringify(dbUsers.users)
		);

		// send refreshToken as cookie using secure httpOnly
		res.cookie("jwt", refreshToken, {
			httpOnly: true,
			samesite: "None",
			secure: true,
			maxAge: 24 * 60 * 60 * 1000,
		});

		// accesToken should be stored in memory or state when client access it
		res.json({ accessToken });
	} else {
		res.status(401).json({ message: "please enter correct password" });
	}
};

module.exports = loginController;
