// user.resolvers.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "../models/user.server.model.js";
import PlayerModel from "../models/player.server.model.js";
import TournamentModel from "../models/tournament.model.js";

const JWT_SECRET = process.env.JWT_SECRET;

const userResolvers = {
  Query: {
    user: async (_, { id }) => await UserModel.findById(id),
    isLoggedIn: (_, __, { req }) => !!req.user,
  },
  Mutation: {
    createUser: async (_, { username, email, password, role }) => {
      const newUser = new UserModel({ username, email, password, role });
      await newUser.save();
      console.log(role);
      if (role === "Player") {
        const player = new PlayerModel({
          user: newUser._id,
          ranking: 0,
          tournaments: [],
        });
        await player.save();
      }

      return {
        id: newUser._id.toString(), // Convert MongoDB `_id` to GraphQL `id`
        ...newUser.toObject(),
      };
    },
    updateUser: async (_, { id, username, email }) => {
      try {
        const updatedUser = await UserModel.findByIdAndUpdate(
          id,
          { username, email },
          { new: true }
        );
        if (!updatedUser) {
          throw new Error(`Achievement with ID ${id} not found`);
        }
        return {
          id: updatedUser._id.toString(), // Convert MongoDB `_id` to GraphQL `id`
          ...updatedUser.toObject(),
        };
      } catch (error) {
        console.error("Error updating user:", error);
        throw new Error("Failed to update user");
      }
    },
    login: async (_, { email, password }, { res }) => {
      const user = await UserModel.findOne({ email });
      if (!user || !(await bcrypt.compare(password, user.password)))
        throw new Error("Invalid email or password");
      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
      res.cookie("token", token, { httpOnly: true });
      return user;
    },
    logOut: (_, __, { res }) => {
      res.clearCookie("token");
      return "Logged out successfully!";
    },
    deleteUser: async (_, { userId }) => {
      const user = await UserModel.findById(userId);
      if (!user) throw new Error("User not found");

      const player = await PlayerModel.findOne({ user: userId });
      if (player) {
        const tournaments = await TournamentModel.find({
          _id: { $in: player.tournaments },
        });

        for (let tournament of tournaments) {
          if (tournament.status === "Upcoming") {
            const playerIndex = tournament.players.indexOf(player._id);
            if (playerIndex !== -1) {
              tournament.players.splice(playerIndex, 1);
              await tournament.save();
            }
          }
        }

        await PlayerModel.updateOne(
          { _id: player._id },
          { $set: { user: null } }
        );
      }

      await UserModel.findByIdAndDelete(userId);
      return `User ${userId} deleted successfully`;
    },
  },
};

export default userResolvers;
