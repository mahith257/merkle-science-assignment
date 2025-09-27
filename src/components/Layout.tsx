import Header from "./Header";
import Sidebar from "./Sidebar";
import type { IChatThread } from "../global/types";
import { useState } from "react";
import { Outlet } from "react-router";

const Layout = () => {
  const [chatHistory, setChatHistory] = useState<IChatThread[]>(() => {
    try {
      if (localStorage.getItem("chatHistory")) {
        return JSON.parse(localStorage.getItem("chatHistory") || "[]");
      }
      return [];
    } catch (error) {
      console.error("Error parsing chat history:", error);
      return [];
    }
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(
    window.matchMedia("(max-width: 639px)").matches ? false : true
  );

  const handleSidebarToggle = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleAddChatThread = (thread: IChatThread) => {
    setChatHistory((prev) => {
      if (prev.find((t) => t.id === thread.id)) {
        const newChatHistory = prev.map((t) =>
          t.id === thread.id ? thread : t
        );
        localStorage.setItem("chatHistory", JSON.stringify(newChatHistory));
        return newChatHistory;
      }

      localStorage.setItem("chatHistory", JSON.stringify([...prev, thread]));
      return [...prev, thread];
    });
  };

  return (
    <div className="w-full h-screen max-w-full flex flex-col gap-3 p-4 overflow-hidden">
      <Header
        isSidebarOpen={isSidebarOpen}
        handleSidebarToggle={handleSidebarToggle}
        chatHistory={chatHistory}
      />
      <div className="w-full max-w-full h-full flex gap-3 items-start min-h-0 overflow-hidden">
        <Sidebar
          isOpen={isSidebarOpen}
          onToggle={handleSidebarToggle}
          className="hidden sm:flex"
          chatHistory={chatHistory}
        />
        <div className="flex-1 h-full min-h-0 min-w-0 overflow-hidden">
          <Outlet context={{ chatHistory, handleAddChatThread }} />
        </div>
      </div>
    </div>
  );
};

export default Layout;
