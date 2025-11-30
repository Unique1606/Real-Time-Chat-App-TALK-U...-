import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isCheckingAuth: true,

  // ⭐ NEW: Friend-related state
  friends: [],
  pendingRequests: [],

  // ⭐ Theme preference
  theme: "light",

  onlineUsers: [],
  socket: null,

  // ============================================================
  //  SETTERS
  // ============================================================

  setAuthUser: (user) => {
    set({
      authUser: user,
      theme: user?.theme || "light",
    });
  },

  setTheme: async (theme) => {
    try {
      await axiosInstance.put("/auth/theme", { theme });
      set({ theme });
      toast.success(`Theme changed to ${theme}`);
    } catch (err) {
      toast.error("Failed to change theme");
    }
  },

  // ============================================================
  //  AUTH CHECK
  // ============================================================

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({
        authUser: res.data,
        theme: res.data.theme || "light",
      });

      // Fetch friends + requests
      await get().fetchFriends();
      await get().fetchPendingRequests();

      get().connectSocket();
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // ============================================================
  //  SIGNUP
  // ============================================================

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({
        authUser: res.data,
        theme: res.data.theme,
      });

      toast.success("Account created successfully");

      await get().fetchFriends();
      await get().fetchPendingRequests();

      get().connectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      set({ isSigningUp: false });
    }
  },

  // ============================================================
  //  LOGIN
  // ============================================================

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);

      set({
        authUser: res.data,
        theme: res.data.theme,
      });

      toast.success("Logged in successfully");

      await get().fetchFriends();
      await get().fetchPendingRequests();

      get().connectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  // ============================================================
  //  LOGOUT
  // ============================================================

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");

      set({
        authUser: null,
        friends: [],
        pendingRequests: [],
      });

      get().disconnectSocket();
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  },

  // ============================================================
  //  FRIEND SYSTEM FUNCTIONS
  // ============================================================

  sendFriendRequest: async (id) => {
    try {
      const res = await axiosInstance.post(`/friends/request/${id}`);
      toast.success(res.data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send request");
    }
  },

  fetchPendingRequests: async () => {
    try {
      const res = await axiosInstance.get("/friends/requests");
      set({ pendingRequests: res.data });
    } catch (err) {
      console.log("Error fetching pending requests:", err);
    }
  },

  respondToFriendRequest: async (requestId, action) => {
    try {
      const res = await axiosInstance.post(
        `/friends/requests/${requestId}`,
        { action }
      );

      toast.success(res.data.message);

      await get().fetchFriends();
      await get().fetchPendingRequests();
    } catch (err) {
      toast.error("Failed to update request");
    }
  },

  fetchFriends: async () => {
    try {
      const res = await axiosInstance.get("/friends/friends");
      set({ friends: res.data });
    } catch (err) {
      console.log("Failed to load friends:", err);
    }
  },

  // ============================================================
  //  SOCKET CONNECTION HANDLING
  // ============================================================

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });

    socket.connect();
    set({ socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));
