import { Schema, model } from "mongoose";

const huntSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    clues: [{ type: Schema.Types.ObjectId, ref: "Clue" }], // 👈 array of clue IDs
    createdBy: { type: Schema.Types.ObjectId, ref: "User" }, // 👈 optional, if you add users
  },
  { timestamps: true }
);

export default model("Hunt", huntSchema);
