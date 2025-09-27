import { createContext } from "react";

export interface ApiKeyContextType {
  apiKey: string;
  setApiKey: (key: string) => void;
  hasApiKey: boolean;
}

export const ApiKeyContext = createContext<ApiKeyContextType | undefined>(
  undefined
);
