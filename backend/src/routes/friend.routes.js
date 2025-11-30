import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";

import {
  sendFriendRequest,
  getPendingRequests,
  respondToFriendRequest,
  getMyFriends,
} from "../controllers/friend.controller.js";

const router = express.Router();

// ⭐ Send friend request to user :id
router.post("/request/:id", protectRoute, sendFriendRequest);

// ⭐ Get all friend requests sent to me
router.get("/requests", protectRoute, getPendingRequests);

// ⭐ Accept / Reject request
router.post("/requests/:requestId", protectRoute, respondToFriendRequest);

// ⭐ Get all accepted friends (for sidebar)
router.get("/friends", protectRoute, getMyFriends);

export default router;
