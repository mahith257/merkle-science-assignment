import { useState, useEffect, type ReactNode } from "react";
import { ApiKeyContext, type ApiKeyContextType } from "./apiKeyTypes";

interface ApiKeyProviderProps {
  children: ReactNode;
}

export default function ApiKeyProvider({ children }: ApiKeyProviderProps) {
  const [apiKey, setApiKeyState] = useState<string>("");

  // Load API key from localStorage on mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem("openai-api-key");
    if (savedApiKey) {
      setApiKeyState(savedApiKey);
    }
  }, []);

  // Save API key to localStorage when it changes
  const setApiKey = (key: string) => {
    setApiKeyState(key);
    if (key.trim()) {
      localStorage.setItem("openai-api-key", key.trim());
    } else {
      localStorage.removeItem("openai-api-key");
    }
  };

  const hasApiKey = apiKey.trim().length > 0;

  const value: ApiKeyContextType = {
    apiKey,
    setApiKey,
    hasApiKey,
  };

  return (
    <ApiKeyContext.Provider value={value}>{children}</ApiKeyContext.Provider>
  );
}
