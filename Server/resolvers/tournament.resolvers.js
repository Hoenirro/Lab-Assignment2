import TournamentModel from "../models/tournament.model.js";
import PlayerModel from "../models/player.server.model.js";

const tournamentResolvers = {
  Query: {
    tournaments: async () => {
      return await TournamentModel.find().populate("players");
    },
    tournament: async (_, { id }) => {
      return await TournamentModel.findById(id).populate("players");
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
      return tournament;
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

      return await TournamentModel.findById(tournamentId).populate("players");
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

      return await TournamentModel.findById(tournamentId).populate("players");
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
      return await TournamentModel.findById(tournamentId).populate("players");
    },
  },
};

export default tournamentResolvers;
