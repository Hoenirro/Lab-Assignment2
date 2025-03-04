import PlayerModel from "../models/player.server.model.js";

const playerResolvers = {
  Query: {
    player: async (_, { id }) => await PlayerModel.findById(id).populate("user").populate("tournaments"),
    players: async () => {
      return await PlayerModel.find().populate("user").populate("tournaments");
    },
  },  
};

export default playerResolvers;
