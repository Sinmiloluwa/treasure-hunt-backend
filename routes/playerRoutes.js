import { Router } from "express";
import Player from "../models/player.js";

const router = Router();

// Register player
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;
    const player = new Player({ name });
    await player.save();
    res.json(player);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all players
router.get("/", async (req, res) => {
  try {
    const players = await find().sort({ score: -1 });
    res.json(players);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;