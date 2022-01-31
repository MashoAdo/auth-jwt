const bcrypt = require("bcrypt");
const User = require("../model/Users");

const registerController = async (req, res) => {
	const { username, password } = req.body;

	if (!username || !password) {
		res.status(401).json({ message: "please entor username or password" });
	} else {
		const duplicate = User.find(User.username === username);
		if (duplicate) {
			res
				.status(409)
				.json({ message: "user already exisits please user another name" });
		}

		try {
			const hashedPassword = await bcrypt.hash(password, 10);

			// create and store new use to db
			User.create({
				username: username,
				password: hashedPassword,
			});

			res.status(201).json({ success: `New user ${username} created` });
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	}
};

module.exports = registerController;

// Registered user to db
