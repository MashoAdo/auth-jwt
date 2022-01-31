const express = require("express");
const logoutHandle = require("../controllers/logoutController");
const router = express.Router();

router.get("/", logoutHandle);

module.exports = router;
