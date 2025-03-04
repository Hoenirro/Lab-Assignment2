// // resolvers.js code for the resolvers of the GraphQL server
// const Achievement = require("../models/achievement");

// const resolvers = {
// 	Query: {
// 		achievements: async () => {
// 			try {
// 				const achievements = await Achievement.find();
// 				return achievements.map((achievement) => ({
// 					id: achievement._id.toString(), // Convert MongoDB `_id` to GraphQL `id`
// 					...achievement.toObject(),
// 				}));
// 			} catch (error) {
// 				console.error("Error fetching achievements:", error);
// 				throw new Error("Failed to fetch achievements");
// 			}
// 		},
// 		achievement: async (_, { id }) => {
// 			try {
// 				console.log("Fetching achievement with ID:", id);
// 				const achievement = await Achievement.findById(id);
// 				if (!achievement) {
// 					console.log(`Achievement with ID ${id} not found`);
// 					throw new Error(`Achievement with ID ${id} not found`);
// 				}
// 				return {
// 					id: achievement._id.toString(),
// 					...achievement.toObject(),
// 				};
// 			} catch (error) {
// 				console.error("Error fetching achievement by ID:", error);
// 				throw new Error("Failed to fetch achievement");
// 			}
// 		},
// 		achievementsByPlayer: async (_, { playerId }) => {
// 			try {
// 				const achievements = await Achievement.find({ playerId });
// 				return achievements.map((achievement) => ({
// 					id: achievement._id.toString(),
// 					...achievement.toObject(),
// 				}));
// 			} catch (error) {
// 				console.error("Error fetching achievements by player ID:", error);
// 				throw new Error("Failed to fetch achievements");
// 			}
// 		},
// 	},
// 	Mutation: {
// 		createAchievement: async (_, args) => {
// 			try {
// 				console.log("Creating new achievement with args:", args);
// 				const achievement = new Achievement(args);
// 				const newAchievement = await achievement.save();
// 				console.log("New achievement saved:", newAchievement);
// 				return {
// 					id: newAchievement._id.toString(), // Convert MongoDB `_id` to GraphQL `id`
// 					...newAchievement.toObject(),
// 				};
// 			} catch (error) {
// 				console.error("Error adding achievement:", error.message);
// 				throw new Error("Failed to add achievement");
// 			}
// 		},
// 		updateAchievement: async (_, { id, ...update }) => {
// 			try {
// 				const updatedAchievement = await Achievement.findByIdAndUpdate(
// 					id,
// 					update,
// 					{
// 						new: true,
// 					}
// 				);
// 				if (!updatedAchievement) {
// 					throw new Error(`Achievement with ID ${id} not found`);
// 				}
// 				return {
// 					id: updatedAchievement._id.toString(), // Convert MongoDB `_id` to GraphQL `id`
// 					...updatedAchievement.toObject(),
// 				};
// 			} catch (error) {
// 				console.error("Error updating achievement:", error);
// 				throw new Error("Failed to update achievement");
// 			}
// 		},
// 		deleteAchievement: async (_, { id }) => {
// 			try {
// 				const deletedAchievement = await Achievement.findByIdAndDelete(id);
// 				if (!deletedAchievement) {
// 					throw new Error(`Achievement with ID ${id} not found`);
// 				}
// 				return {
// 					id: deletedAchievement._id.toString(), // Convert MongoDB `_id` to GraphQL `id`
// 					...deletedAchievement.toObject(),
// 				};
// 			} catch (error) {
// 				console.error("Error deleting achievement:", error);
// 				throw new Error("Failed to delete achievement");
// 			}
// 		},
// 	},
// };

// module.exports = resolvers;
