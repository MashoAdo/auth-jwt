const express = require("express");
const router = express.Router();
const refreshAccessToken = require("../controllers/refreshAccessToken");

router.get("/", refreshAccessToken);

module.exports = router;
