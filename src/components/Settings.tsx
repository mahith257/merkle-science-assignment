import React, { useState } from "react";
import { useApiKey } from "../hooks/useApiKey";
import {
  MdSettings,
  MdKey,
  MdSave,
  MdVisibility,
  MdVisibilityOff,
} from "react-icons/md";

const Settings: React.FC = () => {
  const { apiKey, setApiKey, hasApiKey } = useApiKey();
  const [inputValue, setInputValue] = useState(apiKey);
  const [showKey, setShowKey] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setApiKey(inputValue);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleClear = () => {
    setInputValue("");
    setApiKey("");
    setIsSaved(false);
  };

  const isValidKey = inputValue.startsWith("sk-") && inputValue.length > 20;

  return (
    <div className="w-full max-w-full h-full flex flex-col gap-6 min-h-0 relative overflow-hidden">
      <div className="w-full max-w-full bg-[#FFFFFF33] blur-background sm:bg-white sm:blur-none sm:text-black rounded-[20px] py-6 px-6 sm:px-8 flex flex-col gap-6 overflow-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <MdSettings className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-white sm:text-black">
            Settings
          </h1>
        </div>

        {/* API Key Section */}
        <div className="bg-white/10 sm:bg-gray-50 rounded-xl p-6 border border-white/20 sm:border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <MdKey className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-white sm:text-black">
              OpenAI API Key
            </h2>
          </div>

          <p className="text-white/80 sm:text-gray-600 mb-4 text-sm leading-relaxed">
            Enter your OpenAI API key to enable AI-powered responses. Your key
            is stored locally in your browser and never sent to our servers.
          </p>

          {/* API Key Status */}
          <div className="mb-4">
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                hasApiKey
                  ? "bg-green-100 text-green-800 border border-green-200"
                  : "bg-yellow-100 text-yellow-800 border border-yellow-200"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  hasApiKey ? "bg-green-500" : "bg-yellow-500"
                }`}
              />
              {hasApiKey ? "API Key Configured" : "No API Key Set"}
            </div>
          </div>

          {/* API Key Input */}
          <div className="space-y-4">
            <div className="relative">
              <input
                type={showKey ? "text" : "password"}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="sk-..."
                className="w-full px-4 py-3 bg-white/20 sm:bg-white border border-white/30 sm:border-gray-300 rounded-lg text-white sm:text-black placeholder-white/60 sm:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 sm:text-gray-400 hover:text-white sm:hover:text-gray-600"
              >
                {showKey ? (
                  <MdVisibilityOff className="w-5 h-5" />
                ) : (
                  <MdVisibility className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Validation Message */}
            {inputValue && !isValidKey && (
              <p className="text-red-400 sm:text-red-600 text-sm">
                Please enter a valid OpenAI API key (starts with "sk-")
              </p>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={!inputValue.trim() || !isValidKey}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  inputValue.trim() && isValidKey
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-gray-400 text-gray-200 cursor-not-allowed"
                }`}
              >
                <MdSave className="w-4 h-4" />
                {isSaved ? "Saved!" : "Save API Key"}
              </button>

              {hasApiKey && (
                <button
                  onClick={handleClear}
                  className="px-4 py-2 border border-white/30 sm:border-gray-300 text-white sm:text-gray-700 rounded-lg hover:bg-white/10 sm:hover:bg-gray-50 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-white/10 sm:bg-blue-50 rounded-xl p-6 border border-white/20 sm:border-blue-200">
          <h3 className="text-lg font-semibold text-white sm:text-blue-900 mb-3">
            How to get your API Key
          </h3>
          <ol className="text-white/80 sm:text-blue-800 text-sm space-y-2 list-decimal list-inside">
            <li>
              Visit{" "}
              <a
                href="https://platform.openai.com/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-300 sm:text-blue-600 hover:underline"
              >
                OpenAI API Keys page
              </a>
            </li>
            <li>Sign in to your OpenAI account</li>
            <li>Click "Create new secret key"</li>
            <li>Copy the key and paste it above</li>
            <li>Save the key to start using AI features</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default Settings;
