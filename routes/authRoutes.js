import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { body, validationResult } from "express-validator";
import User from "../models/user.js";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// JWT middleware to protect routes
export function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
}

router.post(
  "/login",
  [
    body("username")
      .trim()
      .notEmpty().withMessage("Username is required")
      .isLength({ min: 3 }).withMessage("Username must be at least 3 characters")
      .matches(/^\S+$/).withMessage("Username cannot contain spaces"),
    body("password")
      .notEmpty().withMessage("Password is required")
      .isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { username, password } = req.body;
    User.findOne({ username }).then(user => {
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err || !isMatch) {
          return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = jwt.sign({ username: user.username, role: user.role }, JWT_SECRET, { expiresIn: "1h" });
        return res.json({ token, role: user.role });
      });
    });
  }
);

router.post("/register", async (req, res) => {
router.post(
  "/register",
  [
    body("username")
      .trim()
      .notEmpty().withMessage("Username is required")
      .isLength({ min: 3 }).withMessage("Username must be at least 3 characters")
      .matches(/^\S+$/).withMessage("Username cannot contain spaces"),
    body("password")
      .notEmpty().withMessage("Password is required")
      .isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { username, password } = req.body;
    // Check for existing user
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: "Username already exists." });
    }
    const role = "user";
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({ username, password: hashedPassword, role });
    const token = jwt.sign({ username, role }, JWT_SECRET, { expiresIn: "1h" });
    return res.status(201).json({ message: "User registered successfully", token, role });
  }
);
});

// Example protected route
router.get("/profile", authenticateJWT, (req, res) => {
  res.json({ user: req.user });
});

export default router;
