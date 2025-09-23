import express from "express";
import { connect } from "mongoose";
import json from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import clueRoutes from "./routes/clueRoutes.js";
import playerRoutes from "./routes/playerRoutes.js";
import huntRoutes from "./routes/huntRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/clues", clueRoutes);
app.use("/api/players", playerRoutes);
app.use("/api/hunts", huntRoutes);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/treasurehunt";

connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.log(err));
