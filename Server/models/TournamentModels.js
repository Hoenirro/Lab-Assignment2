const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// User Model
const UserSchema = new Schema({
	username: { type: String, required: true, unique: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	role: { type: String, enum: ["Admin", "Player"], required: true },
});

// Hash password before saving
UserSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();
	try {
		const salt = await bcrypt.genSalt(10);
		this.password = await bcrypt.hash(this.password, salt);
		next();
	} catch (err) {
		next(err);
	}
});

// Generate JWT Token
UserSchema.methods.generateAuthToken = function () {
	return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
		expiresIn: "1h",
	});
};

const User = mongoose.model("User", UserSchema);

// Player Model
const PlayerSchema = new Schema({
	user: { type: Schema.Types.ObjectId, ref: "User", required: true },
	ranking: { type: Number, default: 0 },
	tournaments: [{ type: Schema.Types.ObjectId, ref: "Tournament" }],
});

const Player = mongoose.model("Player", PlayerSchema);

// Tournament Model
const TournamentSchema = new Schema({
	name: { type: String, required: true },
	game: { type: String, required: true },
	date: { type: Date, required: true },
	players: [{ type: Schema.Types.ObjectId, ref: "Player" }],
	status: {
		type: String,
		enum: ["Upcoming", "Ongoing", "Completed"],
		required: true,
	},
});

const Tournament = mongoose.model("Tournament", TournamentSchema);

module.exports = { User, Player, Tournament };
