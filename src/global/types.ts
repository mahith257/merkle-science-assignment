export interface IMessage {
  id: string;
  type: "user" | "assistant";
  message: string;
  htmlContent?: string; // Rich text HTML content for user messages
}

export interface IChatThread {
  id: string;
  messages: IMessage[];
  createdAt: string;
  updatedAt: string;
}
