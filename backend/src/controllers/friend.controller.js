import User from "../models/user.model.js";
import FriendRequest from "../models/friendRequest.model.js";

// ⭐ 1) SEND FRIEND REQUEST
export const sendFriendRequest = async (req, res) => {
  try {
    const senderId = req.user._id;
    const receiverId = req.params.id;

    if (!receiverId) {
      return res.status(400).json({ message: "Receiver ID is required" });
    }

    if (senderId.toString() === receiverId.toString()) {
      return res.status(400).json({ message: "You cannot send request to yourself" });
    }

    // Check if already friends
    const sender = await User.findById(senderId);
    if (sender.friends.includes(receiverId)) {
      return res.status(400).json({ message: "You are already friends" });
    }

    // Check if a pending request already exists
    const existing = await FriendRequest.findOne({
      sender: senderId,
      receiver: receiverId,
      status: "pending",
    });

    if (existing) {
      return res.status(400).json({ message: "Friend request already sent" });
    }

    // Create request
    const newRequest = new FriendRequest({
      sender: senderId,
      receiver: receiverId,
    });

    await newRequest.save();

    res.status(201).json({ message: "Friend request sent successfully" });
  } catch (error) {
    console.log("Error in sendFriendRequest:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ⭐ 2) GET MY PENDING REQUESTS
export const getPendingRequests = async (req, res) => {
  try {
    const userId = req.user._id;

    const requests = await FriendRequest.find({
      receiver: userId,
      status: "pending",
    }).populate("sender", "fullName email profilePic");

    res.status(200).json(requests);
  } catch (error) {
    console.log("Error in getPendingRequests:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ⭐ 3) ACCEPT / REJECT REQUEST
export const respondToFriendRequest = async (req, res) => {
  try {
    const userId = req.user._id; // receiver
    const { requestId } = req.params;
    const { action } = req.body; // "accept" or "reject"

    const request = await FriendRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.receiver.toString() !== userId.toString()) {
      return res.status(400).json({ message: "You are not allowed to respond to this request" });
    }

    if (action === "accept") {
      request.status = "accepted";
      await request.save();

      // Add both users to each other's friend list
      await User.findByIdAndUpdate(request.sender, {
        $addToSet: { friends: userId },
      });

      await User.findByIdAndUpdate(userId, {
        $addToSet: { friends: request.sender },
      });

      return res.status(200).json({ message: "Friend request accepted" });
    }

    if (action === "reject") {
      request.status = "rejected";
      await request.save();
      return res.status(200).json({ message: "Friend request rejected" });
    }

    res.status(400).json({ message: "Invalid action" });
  } catch (error) {
    console.log("Error in respondToFriendRequest:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ⭐ 4) GET MY FRIENDS
export const getMyFriends = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).populate(
      "friends",
      "fullName email profilePic"
    );

    res.status(200).json(user.friends);
  } catch (error) {
    console.log("Error in getMyFriends:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
