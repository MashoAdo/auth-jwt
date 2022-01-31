const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const usersSchema = new Schema({
	username: String,
	role: {
		User: {
			type: Number,
			default: true,
		},
		Editor: Number,
		Admin: Number,
	},
	password: String,
	refreshToken: String,
});

module.exports = mongoose.model("User", usersSchema);
