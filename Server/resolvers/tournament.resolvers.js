import TournamentModel from "../models/tournament.model.js";
import PlayerModel from "../models/player.server.model.js";
import UserModel from "../models/user.server.model.js";

const tournamentResolvers = {
  Query: {
    tournaments: async () => {
      const tournaments = await TournamentModel.find();
      return tournaments.map((tournament) => ({
        ...tournament.toObject(),
        id: tournament._id.toString(),
        date: tournament.date.toISOString(),
      }));
    },
    tournament: async (_, { id }) => {
      const tournament = await TournamentModel.findById(id).populate({
        path: "players",
        populate: {
          path: "user", // Populate the 'user' field inside each player
        },
      });

      const tournamentObject = {
        ...tournament.toObject(),
        id: tournament._id.toString(),
        date: tournament.date.toISOString(),
        players: tournament.players.map((player) => ({
          ...player,
          id: player._id.toString(),
          user:{
            ...player.user.toObject(),
            id: player.user._id.toString(),
          }
        })),
      };
      console.log(tournamentObject);
      return tournamentObject;
    },
    isPlayerInTournament: async (_, { playerId, tournamentId }) => {
      const tournament = await TournamentModel.findById(tournamentId);
      if (tournament === null) throw new Error("Tournament not found");
      return tournament.players.includes(playerId);
    },
  },
  Mutation: {
    createTournament: async (_, { name, game, date, status }) => {
      const tournament = new TournamentModel({
        name,
        game,
        date,
        status,
        players: [],
      });
      await tournament.save();
      return {
        ...tournament.toObject(),
        id: tournament._id.toString(),
        date: tournament.date.toISOString(),
      };
    },
    joinTournament: async (_, { playerId, tournamentId }) => {
      const player = await PlayerModel.findById(playerId);
      const tournament = await TournamentModel.findById(tournamentId);

      if (!player || !tournament) {
        throw new Error("Player or Tournament not found");
      }

      if (tournament.status !== "Upcoming") {
        throw new Error("Can only join tournaments with Upcoming status");
      }

      if (!tournament.players.includes(playerId)) {
        tournament.players.push(playerId);
        await tournament.save();
      }

      if (!player.tournaments.includes(tournamentId)) {
        player.tournaments.push(tournamentId);
        await player.save();
      }

      const updatedTournament = await TournamentModel.findById(
        tournamentId
      ).populate("players");
      return {
        ...updatedTournament.toObject(),
        id: updatedTournament._id.toString(),
        date: updatedTournament.date.toISOString(),
      };
    },
    removeFromTournament: async (_, { playerId, tournamentId }) => {
      const player = await PlayerModel.findById(playerId);
      const tournament = await TournamentModel.findById(tournamentId);

      if (!player || !tournament) {
        throw new Error("Player or Tournament not found");
      }

      if (tournament.status !== "Upcoming") {
        throw new Error(
          "Can only remove players from tournaments with Upcoming status"
        );
      }

      const playerIndex = tournament.players.indexOf(playerId);
      if (playerIndex !== -1) {
        tournament.players.splice(playerIndex, 1);
        await tournament.save();
      }

      const tournamentIndex = player.tournaments.indexOf(tournamentId);
      if (tournamentIndex !== -1) {
        player.tournaments.splice(tournamentIndex, 1);
        await player.save();
      }

      const updatedTournament = await TournamentModel.findById(
        tournamentId
      ).populate("players");
      return {
        ...updatedTournament.toObject(),
        date: updatedTournament.date.toISOString(),
      };
    },
    editTournament: async (_, { tournamentId, name, game, date, status }) => {
      const tournament = await TournamentModel.findById(tournamentId);
      if (!tournament) throw new Error("Tournament not found");

      if (tournament.status === "Completed") {
        throw new Error("Cannot edit Completed tournaments");
      }

      // Update only the provided fields, preserving players
      if (name !== undefined) tournament.name = name;
      if (game !== undefined) tournament.game = game;
      if (date !== undefined) tournament.date = date;
      if (status !== undefined) tournament.status = status;

      await tournament.save();
      const updatedTournament = await TournamentModel.findById(
        tournamentId
      ).populate("players");
      return {
        ...updatedTournament.toObject(),
        date: updatedTournament.date.toISOString(),
      };
    },
  },
};

export default tournamentResolvers;
