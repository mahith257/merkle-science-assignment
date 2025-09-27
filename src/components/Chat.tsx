import { useEffect, useMemo, useState, useRef } from "react";
import MessageRenderer from "./MessageRenderer";
import { AIService, type IChatMessage } from "../services/openai";
import type { IChatThread, IMessage } from "../global/types";
import { useNavigate, useParams, useOutletContext } from "react-router";
import RichTextEditor from "./RichTextEditor";
import { useApiKey } from "../hooks/useApiKey";

interface OutletContext {
  chatHistory: IChatThread[];
  handleAddChatThread: (thread: IChatThread) => void;
}

const Chat = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { apiKey } = useApiKey();
  const { chatHistory, handleAddChatThread } =
    useOutletContext<OutletContext>();
  const [messages, setMessages] = useState<IMessage[]>(
    chatHistory.find((thread) => thread.id === id)?.messages || []
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(chatHistory.find((thread) => thread.id === id)?.messages || []);
  }, [id]);

  const currentThread = useMemo(() => {
    return chatHistory.find((thread) => thread.id === id);
  }, [chatHistory, id]);

  // Auto-scroll to bottom function
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Auto-scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-scroll when loading state changes (for immediate feedback)
  useEffect(() => {
    if (isLoading) {
      scrollToBottom();
    }
  }, [isLoading]);

  const handleSendMessage = async (
    userMessage: string,
    htmlContent?: string
  ) => {
    if (!userMessage.trim()) return;

    const newId = Date.now().toString();

    if (!id && messages.length === 0) {
      navigate(`/${newId}`);
    }

    // Add user message
    const userMsg: IMessage = {
      id: Date.now().toString(),
      type: "user",
      message: userMessage,
      htmlContent: htmlContent,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    // Create a placeholder assistant message for streaming
    const assistantMsgId = (Date.now() + 1).toString();
    const assistantMsg: IMessage = {
      id: assistantMsgId,
      type: "assistant",
      message: "",
    };

    setMessages((prev) => {
      const updatedMessages = [...prev, assistantMsg];
      handleAddChatThread({
        id: id || newId,
        messages: updatedMessages,
        createdAt:
          id && currentThread
            ? currentThread.createdAt
            : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      return updatedMessages;
    });

    try {
      // Convert messages to OpenAI format
      const chatMessages: IChatMessage[] = [
        {
          role: "system",
          content:
            "You are a specialized AI assistant expert in cryptocurrency, blockchain technology, DeFi, NFTs, and Web3. You provide accurate, detailed, and educational responses about crypto and blockchain topics. Structure your responses with clear headings, bullet points, and include relevant code examples when applicable. Cover technical concepts, market analysis, security best practices, regulatory aspects, and emerging trends. Always prioritize accuracy and provide up-to-date information while explaining complex concepts in an accessible manner.",
        },
        ...messages.map((msg) => ({
          role: msg.type,
          content: msg.message,
        })),
        { role: "user", content: userMessage },
      ];

      // Get streaming response from AI service
      const response = await AIService.sendMessageWithProviderStreaming(
        chatMessages,
        (chunk: string) => {
          // Update the assistant message with each chunk
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMsgId
                ? { ...msg, message: msg.message + chunk }
                : msg
            )
          );
          // Auto-scroll during streaming for better UX
          setTimeout(() => scrollToBottom(), 0);
        },
        apiKey ? "openai" : "local", // Use OpenAI if API key is available, otherwise use local
        apiKey
      );

      // Final update to ensure we have the complete response
      setMessages((prev) => {
        const updatedMessages = prev.map((msg) =>
          msg.id === assistantMsgId ? { ...msg, message: response } : msg
        );

        // Save to chat history
        handleAddChatThread({
          id: id || newId,
          messages: updatedMessages,
          createdAt:
            id && currentThread
              ? currentThread.createdAt
              : new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });

        return updatedMessages;
      });
    } catch (error) {
      console.error("Error sending message:", error);

      // Replace the placeholder message with error message
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Sorry, something went wrong. Please try again.";

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMsgId ? { ...msg, message: errorMessage } : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-full h-full flex flex-col gap-1 min-h-0 relative overflow-hidden">
      <div
        ref={chatContainerRef}
        className={`w-full max-w-full h-[75%] bg-[#FFFFFF33] blur-background sm:bg-white sm:blur-none sm:text-black rounded-[20px] py-4 pl-4 sm:pl-15 pr-4 flex flex-col gap-3 overflow-auto ${
          messages.length === 0 ? "justify-center items-center" : ""
        }`}
      >
        {messages.map((message) => {
          return (
            <div
              key={message.id}
              className={`w-fit max-w-full h-fit flex gap-2 ${
                message.type === "user"
                  ? "justify-end ml-auto"
                  : "flex-row-reverse mr-auto"
              }`}
            >
              <div
                className={`w-fit h-fit max-w-[calc(100%-28px)] rounded-xl rounded-tr-none p-2 ${
                  message.type === "user" ? "bg-[#EFF6FF]" : "bg-none"
                } ${
                  message.type === "user"
                    ? "text-[#1E40AF]"
                    : "text-white sm:text-black"
                }`}
              >
                {message.message === "" && isLoading ? (
                  "Searching..."
                ) : message.type === "assistant" ? (
                  <MessageRenderer
                    content={message.message}
                    className="text-white max-w-full sm:text-black"
                  />
                ) : message.htmlContent ? (
                  <div
                    className="rich-text-content"
                    dangerouslySetInnerHTML={{ __html: message.htmlContent }}
                  />
                ) : (
                  message.message
                )}
              </div>
              <div className="w-[20px] h-[20px] sm:w-[30px] sm:h-[30px] gradient-avatar rounded-full flex items-center justify-center text-white text-[8px] sm:text-[10px] border-1 border-white">
                {message.type === "user" ? "U" : "AI"}
              </div>
            </div>
          );
        })}

        {messages.length === 0 ? (
          <p className="text-white text-sm sm:text-black sm:text-xl sm:font-bold">
            Ask anything about blockchain, cryptocurrency
          </p>
        ) : null}

        {/* Invisible element to scroll to */}
        <div ref={messagesEndRef} />
      </div>

      <div className="w-full">
        <RichTextEditor
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default Chat;
