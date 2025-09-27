import Logo from "../assets/logo.svg";
import { RiMenuLine } from "react-icons/ri";
import Sidebar from "./Sidebar";
import { useEffect, useRef } from "react";
import type { IChatThread } from "../global/types";

interface IHeaderProps {
  isSidebarOpen: boolean;
  handleSidebarToggle: () => void;
  chatHistory: IChatThread[];
}

const Header = ({
  isSidebarOpen,
  handleSidebarToggle,
  chatHistory,
}: IHeaderProps) => {
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        handleSidebarToggle();
      }
    };

    const isSmallScreen = window.matchMedia("(max-width: 639px)").matches;

    if (sidebarRef.current && isSidebarOpen && isSmallScreen) {
      document.addEventListener("click", handleClickOutside);
    } else if (sidebarRef.current && (!isSidebarOpen || !isSmallScreen)) {
      document.removeEventListener("click", handleClickOutside);
    }

    return () => document.removeEventListener("click", handleClickOutside);
  }, [isSidebarOpen]);

  const handleOpenSidebar = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    handleSidebarToggle();
  };

  return (
    <>
      <div className="w-full max-w-full h-[54px] flex items-center justify-between">
        <div className="flex items-center w-fit gap-4">
          <button
            className="items-center justify-center p-[7px] w-[30px] h-[30px] bg-white rounded-sm shadow-md cursor-pointer sm:hidden flex"
            onClick={handleOpenSidebar}
          >
            <RiMenuLine className="text-black w-5 h-5" />
          </button>
          <img
            src={Logo}
            alt="logo"
            className="w-[132px] h-[15px] md:w-[180px] md:h-[20px] lg:w-[220px] lg:h-[25px]"
          />
        </div>
        <p className="text-white text-sm">Tracker Chat</p>
      </div>
      {isSidebarOpen ? (
        <div className="w-full h-full bg-[#00000080] block sm:hidden absolute top-0 left-0 z-50">
          <Sidebar
            ref={sidebarRef}
            isOpen={isSidebarOpen}
            onToggle={handleSidebarToggle}
            chatHistory={chatHistory}
          />
        </div>
      ) : null}
    </>
  );
};

export default Header;
