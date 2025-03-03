// achievement.js
// Load the module dependencies
const mongoose = require("mongoose"),
	Schema = mongoose.Schema;
// Define a new 'AchievementSchema'
const AchievementSchema = new Schema({
	playerId: { type: String, required: true },
	title: String,
	points: String,
	earnedAt: String,
	difficultyLevel: String,
	isSecret: Boolean,
});
// Create the 'Contact' model out of the 'ContactSchema'
const Achievement = mongoose.model("Achievement", AchievementSchema);

// Export the 'Achievement' model
module.exports = Achievement;
