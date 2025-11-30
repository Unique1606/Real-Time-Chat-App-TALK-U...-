import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],        // Friends only
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  // ⭐ Fetch friends for sidebar
  getUsers: async () => {
    set({ isUsersLoading: true });

    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });   // Friends list only
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load friends");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  // ⭐ Fetch messages with a friend
  getMessages: async (userId) => {
    set({ isMessagesLoading: true });

    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch messages"
      );
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  // ⭐ Send message (text + optional image)
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    if (!selectedUser) return;

    try {
      const res = await axiosInstance.post(
        `/messages/${selectedUser._id}`,
        messageData,
        { headers: { "Content-Type": "application/json" } }
      );

      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to send message"
      );
    }
  },

  // ⭐ Subscribe to messages only for selected friend
  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      const isForThisChat =
        newMessage.senderId === selectedUser._id ||
        newMessage.receiverId === selectedUser._id;

      if (!isForThisChat) return;

      set({ messages: [...get().messages, newMessage] });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    socket.off("newMessage");
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
