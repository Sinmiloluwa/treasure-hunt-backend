import { Router } from "express";
import Hunt from "../models/hunt.js";
import checkUserIsAdmin from "../middleware/checkUserIsAdmin.js";
import { body, validationResult } from "express-validator";
import { successResponse, errorResponse, notFoundResponse } from "../utils/response.js";
import authenticateJWT from "../middleware/isAuthenticated.js";

const router = Router();

// Create a hunt
router.post("/", [
  body("title").notEmpty().withMessage("Title is required"),
  body("description").notEmpty().withMessage("Description is required"),
  body("startDate").isISO8601().withMessage("Invalid start date"),
  body("endDate").isISO8601().withMessage("Invalid end date"),
  body("clues").optional().isArray().withMessage("Clues must be an array")
], authenticateJWT, checkUserIsAdmin, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { title, description, startDate, endDate, clues } = req.body;
    const hunt = new Hunt({
      title,
      description,
      startDate,
      endDate,
      clues: clues || []
    });
    await hunt.save();
    return successResponse(res, hunt, "Hunt created successfully", 201);
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
});

router.patch("/:id/clues", authenticateJWT, checkUserIsAdmin, async (req, res) => {
  const { clues } = req.body;
  if (!Array.isArray(clues)) {
    return res.status(400).json({ message: "Clues must be an array of clue IDs." });
  }
  try {
    const hunt = await Hunt.findByIdAndUpdate(
      req.params.id,
      { $set: { clues } },
      { new: true }
    ).populate("clues");
    if (!hunt) {
      return notFoundResponse(res, "Hunt not found");
    }
    return successResponse(res, hunt, "Clues attached successfully", 200);
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
});

// Get all hunts
router.get("/", async (req, res) => {
  try {
        const filter = {};
        if (req.query.title) {
          filter.title = { $regex: req.query.title, $options: "i" };
        }
        if (req.query.startDate) {
          filter.startDate = { $gte: req.query.startDate };
        }
        if (req.query.endDate) {
          filter.endDate = { $lte: req.query.endDate };
        }
        // Ongoing hunts: current date between startDate and endDate
        if (req.query.ongoing === "true") {
          const now = new Date();
          filter.startDate = { $lte: now };
          filter.endDate = { $gte: now };
        }
        const hunts = await Hunt.find(filter).populate("clues");
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