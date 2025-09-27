import { useState } from "react";
import { GrAttachment } from "react-icons/gr";
import { RiSendPlaneFill } from "react-icons/ri";

interface TextFieldProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const TextField = ({ onSendMessage, isLoading }: TextFieldProps) => {
  const [message, setMessage] = useState<string>("");

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = () => {
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="w-full h-full flex flex-col rounded-xl">
      <textarea
        className="w-full h-full bg-white p-4 text-black outline-none rounded-t-xl"
        placeholder={isLoading ? "AI is thinking..." : "Ask me anything ..."}
        value={message}
        onChange={handleMessageChange}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
      />
      <div className="w-full h-[62px] bg-white border-t-2 border-gray-300 p-4 flex items-center justify-between rounded-b-xl">
        <button className="w-fit h-fit py-[9px] px-[12px] rounded-lg shadow-md border-1 border-gray-200 cursor-pointer flex items-center justify-center">
          <GrAttachment className="text-black w-5 h-5" />
        </button>
        <button
          onClick={handleSendMessage}
          disabled={!message.trim() || isLoading}
          className={`w-fit ${
            message.trim() && !isLoading
              ? "bg-[#2563EB] hover:bg-[#1D4ED8]"
              : "bg-[#60A5FA] cursor-not-allowed"
          } text-white rounded-lg py-[9px] px-[12px] outline-none flex items-center justify-center gap-1 shadow-[0px_1px_2px_0px_#0000000F] transition-colors`}
        >
          {isLoading ? (
            "..."
          ) : (
            <>
              Send
              <RiSendPlaneFill className="text-white w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default TextField;
