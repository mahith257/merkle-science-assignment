import { forwardRef } from "react";
import {
  TbLayoutSidebarLeftCollapseFilled,
  TbLayoutSidebarRightCollapseFilled,
} from "react-icons/tb";
import { Link, useParams, useLocation } from "react-router";
import type { IChatThread } from "../global/types";

interface ISidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
  chatHistory: IChatThread[];
}

const Sidebar = forwardRef<HTMLDivElement, ISidebarProps>(
  ({ isOpen, onToggle, className, chatHistory }, ref) => {
    const { id } = useParams();
    const location = useLocation();

    return isOpen ? (
      <div
        ref={ref}
        className={`w-[40vw] xs:w-[30vw] sm:w-[30vw] md:w-[20vw] lg:w-[20vw] max-w-[300px] h-full bg-white rounded-tr-xl rounded-br-xl p-4 sm:rounded-tl-xl sm:rounded-bl-xl flex flex-col flex-shrink-0 ${className}`}
      >
        <div className="flex flex-col gap-4 flex-1 min-h-0">
          <button
            className="flex items-center justify-center p-2 w-fit bg-white rounded-lg shadow-md cursor-pointer flex-shrink-0"
            onClick={onToggle}
          >
            <TbLayoutSidebarLeftCollapseFilled className="text-black w-5 h-5" />
          </button>
          <div className="flex flex-col gap-1 overflow-y-auto flex-1 min-h-0">
            <Link
              to="/"
              className={`py-3 px-2 text-md font-light hover:bg-blue-100 rounded-md cursor-pointer flex-shrink-0 ${
                id === undefined
                  ? "text-[#2563EB] bg-blue-200 font-medium"
                  : "text-black"
              }`}
            >
              Home
            </Link>
            {chatHistory.map((thread, index) => (
              <Link
                to={`/${thread.id}`}
                key={thread.id}
                className={`py-3 px-2 text-md font-light hover:bg-blue-100 rounded-md cursor-pointer flex-shrink-0 ${
                  id === thread.id
                    ? "text-[#2563EB] bg-blue-200 font-medium"
                    : "text-black"
                }`}
              >
                Chat {index + 1}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4 border-t-2 border-gray-300 pt-1 flex-shrink-0">
          <Link
            to="/settings"
            className={`py-3 px-2 text-md font-light hover:bg-blue-100 rounded-md cursor-pointer text-left ${
              location.pathname === "/settings"
                ? "text-[#2563EB] bg-blue-200 font-medium"
                : "text-black"
            }`}
          >
            Settings
          </Link>
        </div>
      </div>
    ) : (
      <button
        className="items-center justify-center p-2 w-fit bg-white rounded-lg shadow-md cursor-pointer hidden sm:flex"
        onClick={onToggle}
      >
        <TbLayoutSidebarRightCollapseFilled className="text-black w-5 h-5" />
      </button>
    );
  }
);

export default Sidebar;
