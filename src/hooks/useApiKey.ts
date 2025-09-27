import { useContext } from "react";
import { ApiKeyContext, type ApiKeyContextType } from "../contexts/apiKeyTypes";

export const useApiKey = (): ApiKeyContextType => {
  const context = useContext(ApiKeyContext);
  if (context === undefined) {
    throw new Error("useApiKey must be used within an ApiKeyProvider");
  }
  return context;
};
