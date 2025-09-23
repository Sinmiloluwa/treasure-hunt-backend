import { Router } from "express";
import { toDataURL } from "qrcode";
import Clue from "../models/clue.js";

const router = Router();

// Create a clue
router.post("/", async (req, res) => {
  try {
    const { question, answer, nextClueId } = req.body;
    const clue = new Clue({ question, answer, nextClueId });
    await clue.save();

    // Generate QR code that links to this clue
    const qrData = `${req.protocol}://${req.get("host")}/api/clues/${clue._id}`;
    const qrImage = await toDataURL(qrData);

    res.json({ clue, qrImage });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a clue
router.get("/:id", async (req, res) => {
  try {
    const clue = await Clue.findById(req.params.id);
    res.json(clue);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Solve a clue
router.post("/:id/solve", async (req, res) => {
  try {
    const { answer } = req.body;
    const clue = await Clue.findById(req.params.id);

    if (clue.answer.toLowerCase() === answer.toLowerCase()) {
      res.json({ success: true, nextClueId: clue.nextClueId });
    } else {
      res.json({ success: false, message: "Wrong answer!" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
