const verifyRoles = (...allowedRoles) => {
	return (req, res, next) => {
		if (!req?.roles) res.sendStatus(401); //UnAuthorized
		const roles = req.roles;

		const allowedRolesArr = [...allowedRoles];

		console.log(roles);
		console.log(allowedRolesArr);

		const results = roles
			.map((role) => allowedRolesArr.includes(role))
			.find((val) => val === true);

		if (!results) res.sendStatus(401);

		next();
	};
};

module.exports = verifyRoles;
