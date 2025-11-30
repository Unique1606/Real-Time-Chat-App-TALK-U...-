import { useAuthStore } from "../store/useAuthStore";
import { Check, X } from "lucide-react";

const RequestsPage = () => {
  const { pendingRequests, respondToFriendRequest } = useAuthStore();

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Friend Requests</h2>

      {pendingRequests.length === 0 && (
        <div className="text-zinc-500">No pending requests</div>
      )}

      <div className="flex flex-col gap-4">
        {pendingRequests.map((req) => (
          <div
            key={req._id}
            className="p-4 bg-base-200 rounded-lg flex justify-between items-center"
          >
            <div className="flex items-center gap-3">
              <img
                src={req.sender.profilePic || "/avatar.png"}
                className="size-12 rounded-full"
              />
              <div>
                <div className="font-semibold">{req.sender.fullName}</div>
                <div className="text-sm text-zinc-500">
                  {req.sender.email}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                className="btn btn-sm btn-success flex items-center gap-1"
                onClick={() => respondToFriendRequest(req._id, "accept")}
              >
                <Check size={16} /> Accept
              </button>

              <button
                className="btn btn-sm btn-error flex items-center gap-1"
                onClick={() => respondToFriendRequest(req._id, "reject")}
              >
                <X size={16} /> Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RequestsPage;
