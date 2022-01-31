require("dotenv").config();
const express = require("express");
const app = express();

const path = require("path");

const cors = require("cors");
const cookieParser = require("cookie-parser");

const corsOptions = require("./config/corsOption");

const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const verifyJWT = require("./middleware/verify");

const mongoose = require("mongoose");
const connectDB = require("./config/dbConnect");

const PORT = process.env.PORT || 3500;

// conncect to mongoDB
// connectDB();

// custom middleware logger
app.use(logger);

app.use(cors(corsOptions));
app.use(cookieParser());

// built-in middleware to handle urlencoded data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

//serve static files
app.use("/", express.static(path.join(__dirname, "/public")));
app.use("/subdir", express.static(path.join(__dirname, "/public")));

// routes
app.use("/", require("./routes/root"));
app.use("/subdir", require("./routes/subdir"));
app.use("/register", require("./routes/register"));
app.use("/login", require("./routes/login"));

app.use("/refresh", require("./routes/refreshAccessToken"));
app.use("/logout", require("./routes/logout"));
app.use(verifyJWT);
app.use("/employees", require("./routes/api/employees"));

app.all("*", (req, res) => {
	res.status(404);
	if (req.accepts("html")) {
		res.sendFile(path.join(__dirname, "views", "404.html"));
	} else if (req.accepts("json")) {
		res.json({ error: "404 Not Found" });
	} else {
		res.type("txt").send("404 Not Found");
	}
});

app.use(errorHandler);

// mongoose.connection.once("open", () => {
// 	console.log("Connected to MongoDB");
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// });
