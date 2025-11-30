import { useState } from "react";
import { useChatStore } from "../store/useChatStore";

import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

import DiscoverUsersPage from "./DiscoverUsersPage";
import RequestsPage from "./RequestsPage";

const HomePage = () => {
  const { selectedUser } = useChatStore();

  // ⭐ Page modes: "chat" | "discover" | "requests"
  const [page, setPage] = useState("chat");

  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            
            {/* ⭐ Sidebar with page-switching controls */}
            <Sidebar
              onOpenRequests={() => setPage("requests")}
              onOpenDiscover={() => setPage("discover")}
            />

            {/* ⭐ Page Switching Logic */}
            <div className="flex-1 h-full">
              {page === "chat" && (
                !selectedUser ? <NoChatSelected /> : <ChatContainer />
              )}

              {page === "discover" && <DiscoverUsersPage />}

              {page === "requests" && <RequestsPage />}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
