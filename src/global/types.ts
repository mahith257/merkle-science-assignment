export interface IMessage {
  id: string;
  type: "user" | "assistant";
  message: string;
}

export interface IChatThread {
  id: string;
  messages: IMessage[];
  createdAt: string;
  updatedAt: string;
}
