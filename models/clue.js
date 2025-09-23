import { Schema, model } from "mongoose";

const clueSchema = new Schema({
  question: String,
  answer: String,
  nextClueId: { type: Schema.Types.ObjectId, ref: "Clue" }
});

export default model("Clue", clueSchema);
