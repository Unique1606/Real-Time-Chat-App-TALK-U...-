import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";

import {
  getMessages,
  sendMessage,
  getUsersForSidebar,
} from "../controllers/message.controller.js";

const router = express.Router();

// ⭐ Get all friends for sidebar (friends only)
router.get("/users", protectRoute, getUsersForSidebar);

// ⭐ Get messages between logged-in user & selected user (friends only)
router.get("/:id", protectRoute, getMessages);

// ⭐ Send message to user :id (friends only)
router.post("/:id", protectRoute, sendMessage);

export default router;
