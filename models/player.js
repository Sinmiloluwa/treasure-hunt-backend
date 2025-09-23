import { Schema, model } from "mongoose";

const playerSchema = new Schema({
  name: { type: String, required: true },
  currentClue: { type: Schema.Types.ObjectId, ref: "Clue" },
  score: { type: Number, default: 0 }
});

export default model("Player", playerSchema);
