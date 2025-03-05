import mongoose from "mongoose";
const { Schema } = mongoose;
const TournamentSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  game: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  players: [{ type: Schema.Types.ObjectId, ref: "Player" }],
  status: {
    type: String,
    enum: ["Upcoming", "Ongoing", "Completed"],
    required: true,
  },
});

const TournamentModel = mongoose.model("Tournament", TournamentSchema);

export default TournamentModel;
