import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";

import SidebarSkeleton from "./skeletons/SidebarSkeleton";

import {
  Users,
  UserPlus,
  Mail,
  Sun,
  Moon,
} from "lucide-react";

const Sidebar = ({ onOpenRequests, onOpenDiscover }) => {
  const {
    getUsers,
    users,
    selectedUser,
    setSelectedUser,
    isUsersLoading,
  } = useChatStore();

  const { onlineUsers, theme, setTheme } = useAuthStore();

  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  // Load friends list
  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = showOnlineOnly
    ? users.filter((u) => onlineUsers.includes(u._id))
    : users;

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      
      {/* ⭐ TOP HEADER */}
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">FRIENDS</span>
        </div>

        {/* Online Filter */}
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">SHOW ONLINE ONLY</span>
          </label>
          <span className="text-xs text-zinc-500">
            ({onlineUsers.length - 1} ONLINE)
          </span>
        </div>
      </div>

      {/* ⭐ ACTION BUTTONS */}
      <div className="p-4 flex flex-col gap-3 border-b border-base-300">
        {/* Discover Users */}
        <button
          onClick={onOpenDiscover}
          className="btn btn-sm flex items-center gap-2 w-full"
        >
          <UserPlus size={18} />
          <span className="hidden lg:block">Discover Users</span>
        </button>

        {/* Friend Requests */}
        <button
          onClick={onOpenRequests}
          className="btn btn-sm flex items-center gap-2 w-full"
        >
          <Mail size={18} />
          <span className="hidden lg:block">Friend Requests</span>
        </button>

        {/* Theme toggle */}
        <button
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="btn btn-sm flex items-center gap-2 w-full"
        >
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          <span className="hidden lg:block">
            {theme === "light" ? "Dark Mode" : "Light Mode"}
          </span>
        </button>
      </div>

      {/* ⭐ FRIEND LIST */}
      <div className="overflow-y-auto w-full py-3">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
            `}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.fullName}
                className="size-12 object-cover rounded-full"
              />
              {onlineUsers.includes(user._id) && (
                <span
                  className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-zinc-900"
                />
              )}
            </div>

            {/* User info - only visible on larger screens */}
            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{user.fullName}</div>
              <div className="text-sm text-zinc-400">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">
            No friends available
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
