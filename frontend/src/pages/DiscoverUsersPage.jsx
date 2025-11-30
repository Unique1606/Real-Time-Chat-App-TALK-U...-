import { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "../store/useAuthStore";
import { UserPlus } from "lucide-react";
import toast from "react-hot-toast";

const DiscoverUsersPage = () => {
  const { authUser, friends, pendingRequests, sendFriendRequest } =
    useAuthStore();

  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load all users from backend
  const fetchAllUsers = async () => {
    try {
      const res = await axiosInstance.get("/auth/all-users");
      setAllUsers(res.data);
    } catch (err) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  if (loading)
    return <div className="p-6 text-center text-zinc-500">Loading...</div>;

  // Filter out:
  // - myself
  // - my friends
  // - users I already sent request to
  // - users who sent a request to me
  const sentRequestIds = pendingRequests.map((req) => req.sender._id);

  const usersToShow = allUsers.filter(
    (u) =>
      u._id !== authUser._id && // not me
      !friends.some((f) => f._id === u._id) && // not my friend
      !sentRequestIds.includes(u._id) // they haven't requested me
  );

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Discover New Users</h2>

      {usersToShow.length === 0 && (
        <div className="text-zinc-500">No new users available</div>
      )}

      <div className="grid gap-4">
        {usersToShow.map((u) => (
          <div
            key={u._id}
            className="p-4 rounded-lg bg-base-200 flex justify-between items-center"
          >
            <div className="flex items-center gap-3">
              <img
                src={u.profilePic || "/avatar.png"}
                className="size-12 rounded-full"
              />
              <div>
                <div className="font-semibold">{u.fullName}</div>
                <div className="text-sm text-zinc-500">{u.email}</div>
              </div>
            </div>

            <button
              className="btn btn-sm btn-primary flex items-center gap-2"
              onClick={() => sendFriendRequest(u._id)}
            >
              <UserPlus size={16} />
              Send Request
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiscoverUsersPage;
