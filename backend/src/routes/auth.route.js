import express from "express";
import {
  checkAuth,
  login,
  logout,
  signup,
  updateProfile,
  getAllUsers,
} from "../controllers/auth.controller.js";

import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

// Auth routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

// Profile
router.put("/update-profile", protectRoute, updateProfile);

// Check logged-in user
router.get("/check", protectRoute, checkAuth);

// ⭐ New route → return all users (used for Discover Users page)
router.get("/all-users", protectRoute, getAllUsers);

export default router;
