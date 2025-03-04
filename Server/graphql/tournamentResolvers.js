// const { User, Player, Tournament } = require("../models/TournamentModels");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// require("dotenv").config();

// const resolvers = {
// 	Query: {
// 		user: async (_, { id }) => {
// 			return await User.findById(id);
// 		},
// 		tournaments: async () => {
// 			return await Tournament.find().populate("players");
// 		},
// 		tournament: async (_, { id }) => {
// 			return await Tournament.findById(id).populate("players");
// 		},
// 		players: async () => {
// 			return await Player.find().populate("user").populate("tournaments");
// 		},
// 	},
// 	Mutation: {
// 		register: async (_, { username, email, password, role }) => {
// 			const existingUser = await User.findOne({ email });
// 			if (existingUser) throw new Error("Email already in use");

// 			const user = new User({ username, email, password, role });
// 			await user.save();

// 			if (role === "Player") {
// 				const player = new Player({
// 					user: user._id,
// 					ranking: 1000,
// 					tournaments: [],
// 				});
// 				await player.save();
// 			}

// 			const token = user.generateAuthToken();
// 			return { user, token };
// 		},
// 		login: async (_, { email, password }) => {
// 			const user = await User.findOne({ email });
// 			if (!user) throw new Error("User not found");

// 			const isMatch = await bcrypt.compare(password, user.password);
// 			if (!isMatch) throw new Error("Invalid credentials");

// 			const token = user.generateAuthToken();
// 			return { user, token };
// 		},
// 		createTournament: async (_, { name, game, date, status }) => {
// 			const tournament = new Tournament({
// 				name,
// 				game,
// 				date,
// 				status,
// 				players: [],
// 			});
// 			await tournament.save();
// 			return tournament;
// 		},
// 		joinTournament: async (_, { playerId, tournamentId }) => {
// 			const player = await Player.findById(playerId);
// 			const tournament = await Tournament.findById(tournamentId);

// 			if (!player || !tournament) {
// 				throw new Error("Player or Tournament not found");
// 			}

// 			if (tournament.status !== "Upcoming") {
// 				throw new Error("Can only join tournaments with Upcoming status");
// 			}

// 			if (!tournament.players.includes(playerId)) {
// 				tournament.players.push(playerId);
// 				await tournament.save();
// 			}

// 			if (!player.tournaments.includes(tournamentId)) {
// 				player.tournaments.push(tournamentId);
// 				await player.save();
// 			}

// 			return await Tournament.findById(tournamentId).populate("players");
// 		},
// 		removeFromTournament: async (_, { playerId, tournamentId }) => {
// 			const player = await Player.findById(playerId);
// 			const tournament = await Tournament.findById(tournamentId);

// 			if (!player || !tournament) {
// 				throw new Error("Player or Tournament not found");
// 			}

// 			if (tournament.status !== "Upcoming") {
// 				throw new Error(
// 					"Can only remove players from tournaments with Upcoming status"
// 				);
// 			}

// 			const playerIndex = tournament.players.indexOf(playerId);
// 			if (playerIndex !== -1) {
// 				tournament.players.splice(playerIndex, 1);
// 				await tournament.save();
// 			}

// 			const tournamentIndex = player.tournaments.indexOf(tournamentId);
// 			if (tournamentIndex !== -1) {
// 				player.tournaments.splice(tournamentIndex, 1);
// 				await player.save();
// 			}

// 			return await Tournament.findById(tournamentId).populate("players");
// 		},
// 		deleteUser: async (_, { userId }) => {
// 			const user = await User.findById(userId);
// 			if (!user) throw new Error("User not found");

// 			const player = await Player.findOne({ user: userId });
// 			if (player) {
// 				const tournaments = await Tournament.find({
// 					_id: { $in: player.tournaments },
// 				});

// 				for (let tournament of tournaments) {
// 					if (tournament.status === "Upcoming") {
// 						const playerIndex = tournament.players.indexOf(player._id);
// 						if (playerIndex !== -1) {
// 							tournament.players.splice(playerIndex, 1);
// 							await tournament.save();
// 						}
// 					}
// 				}

// 				await Player.updateOne({ _id: player._id }, { $set: { user: null } });
// 			}

// 			await User.findByIdAndDelete(userId);
// 			return `User ${userId} deleted successfully`;
// 		},
// 		editTournament: async (_, { tournamentId, name, game, date, status }) => {
// 			const tournament = await Tournament.findById(tournamentId);
// 			if (!tournament) throw new Error("Tournament not found");

// 			if (tournament.status === "Completed") {
// 				throw new Error("Cannot edit Completed tournaments");
// 			}

// 			// Update only the provided fields, preserving players
// 			if (name !== undefined) tournament.name = name;
// 			if (game !== undefined) tournament.game = game;
// 			if (date !== undefined) tournament.date = date;
// 			if (status !== undefined) tournament.status = status;

// 			await tournament.save();
// 			return await Tournament.findById(tournamentId).populate("players");
// 		},
// 	},
// 	Tournament: {
// 		id: (tournament) => tournament._id.toString(),
// 		players: async (tournament) => {
// 			return await Player.find({ _id: { $in: tournament.players || [] } });
// 		},
// 	},
// 	Player: {
// 		id: (player) => player._id.toString(),
// 		user: async (player) => {
// 			if (!player.user) {
// 				return {
// 					id: "deleted-" + player._id.toString(),
// 					username: `${player._id.toString()} -deleted from website-`,
// 					email: null,
// 					role: null,
// 				};
// 			}
// 			const user = await User.findById(player.user);
// 			return user || null;
// 		},
// 		tournaments: async (player) =>
// 			await Tournament.find({ _id: { $in: player.tournaments || [] } }), // Handle empty tournaments
// 	},
// 	User: {
// 		id: (user) => (user ? user._id.toString() : null), // Handle null user
// 	},
// };

// module.exports = resolvers;
