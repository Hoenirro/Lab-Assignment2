import mongoose from "mongoose";

const { Schema } = mongoose;
const PlayerSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  ranking: {
    type: Number,
    default: 0,
  },
  tournaments: [{ type: Schema.Types.ObjectId, ref: "Tournament" }],
});

const PlayerModel = mongoose.model("Player", PlayerSchema);

export default PlayerModel;
