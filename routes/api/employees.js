const express = require("express");
const router = express.Router();
const employeeController = require("../../controllers/employees");
const verifyRoles = require("../../middleware/verifyRole");
const ROLES_LIST = require("../../config/userRoles");

router
	.route("/")
	.get(employeeController.getAllEmployees)
	.post(
		verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
		employeeController.creatEmployee
	)
	.put(
		verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
		employeeController.updateEmployee
	)
	.delete(verifyRoles(ROLES_LIST.Admin), employeeController.deleteEmployee);

router.route("/:id").get(employeeController.getIndividualEmployee);

module.exports = router;
