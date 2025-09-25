import { Router } from "express";
import Hunt from "../models/hunt.js";
import checkRole from "../middleware/checkRole.js";
import { successResponse, errorResponse, notFoundResponse } from "../utils/response.js";

const router = Router();

// Create a hunt
router.post("/", checkRole("admin"), async (req, res) => {
  try {
    const { title, description, startDate, endDate, clues } = req.body;
    const hunt = new Hunt({ title, description, startDate, endDate, clues });
    await hunt.save();
    return successResponse(res, hunt, "Hunt created successfully", 201);
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
});

// Get all hunts
router.get("/", async (req, res) => {
  try {
    const hunts = await Hunt.find().populate("clues");
    return successResponse(res, hunts, "Hunts retrieved successfully", 200);
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
});

// Get a specific hunt
router.get("/:id", async (req, res) => {
  try {
    const hunt = await Hunt.findById(req.params.id).populate("clues");
    res.json(hunt);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;