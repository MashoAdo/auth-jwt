const data = {};
data.employees = require("../model/employees.json");

const getAllEmployees = (req, res) => {
	res.json(data.employees);
};

const creatEmployee = (req, res) => {
	res.json({
		firstname: req.body.firstname,
		lastname: req.body.lastname,
	});
};

const updateEmployee = (req, res) => {
	res.json({
		firstname: req.body.firstname,
		lastname: req.body.lastname,
	});
};

const deleteEmployee = (req, res) => {
	res.json({ message: "employee deleted" });
};

const getIndividualEmployee = (req, res) => {
	res.json(data.employees.find((item) => item.id == req.params.id));
};

module.exports = {
	getAllEmployees,
	creatEmployee,
	updateEmployee,
	deleteEmployee,
	getIndividualEmployee,
};
