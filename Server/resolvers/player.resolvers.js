import UserModel from "../models/user.server.model.js";
import PlayerModel from "../models/player.server.model.js";

const playerResolvers = {
  Query: {
    player: async (_, { id }) =>
      await PlayerModel.findById(id).populate("user").populate("tournaments"),
    playerByUserId: async (_, { userId }) => {
      const player = await PlayerModel.findOne({ user: userId })
        .populate("user")
        .populate("tournaments");
      if (!player) throw new Error("Player not found");
      return player;
    },
    playerByUsername: async (_, { username }) => {
      if (!username.trim()) {
        throw new Error("Username cannot be empty");
      }
      const players = await PlayerModel.find()
        .populate({
          path: "user",
          match: { username: { $regex: username, $options: "i" } }, // Case-insensitive partial match
        });

      // Remove players where user is null (no match)
      const filteredPlayers = players.filter((player) => player.user);      
      if (filteredPlayers.length === 0)
        throw new Error("No players found with the given username");
    
      return filteredPlayers.map((filteredPlayer) => ({
        ...filteredPlayer.toObject(),
        id: filteredPlayer._id.toString(),
        user: {
          ...filteredPlayer.user.toObject(),
          id: filteredPlayer.user._id.toString()
        }
      }));
    },
    players: async () => {
      return await PlayerModel.find().populate("user").populate("tournaments");
    },
  },
};

export default playerResolvers;
