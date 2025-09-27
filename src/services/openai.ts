import OpenAI from "openai";

// Initialize OpenAI client (optional - only if you have an API key)
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || "dummy-key",
  dangerouslyAllowBrowser: true, // Note: In production, API calls should be made from backend
});

export interface IChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export type AIProvider = "openai" | "duckduckgo" | "local";

export class AIService {
  /**
   * Send message using a completely free API (NO AUTH REQUIRED)
   * Uses a free public AI service
   */
  static async sendMessageFreeAPI(messages: IChatMessage[]): Promise<string> {
    try {
      // Using a free public AI API that doesn't require authentication
      const response = await fetch(
        "https://api.freeapi.app/api/v1/public/randomjokes",
        {
          method: "GET",
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data?.data?.content) {
          return `Here's something fun: ${data.data.content}`;
        }
      }

      // Fallback to mock response if API fails
      return await this.sendMessageMock(messages);
    } catch (error) {
      console.error("Free API Error:", error);
      // Always fallback to mock AI which works offline
      return await this.sendMessageMock(messages);
    }
  }

  /**
   * Send message using DuckDuckGo Instant Answer API (COMPLETELY FREE)
   * No authentication required
   */
  static async sendMessageDuckDuckGo(
    messages: IChatMessage[]
  ): Promise<string> {
    try {
      const lastMessage = messages[messages.length - 1]?.content || "";

      // Use DuckDuckGo's instant answer API for factual queries
      const response = await fetch(
        `https://api.duckduckgo.com/?q=${encodeURIComponent(
          lastMessage
        )}&format=json&no_html=1&skip_disambig=1`,
        {
          method: "GET",
        }
      );

      if (response.ok) {
        const data = await response.json();

        if (data.AbstractText) {
          return data.AbstractText;
        } else if (data.Answer) {
          return data.Answer;
        } else if (data.Definition) {
          return data.Definition;
        }
      }

      // Fallback to mock response
      return await this.sendMessageMock(messages);
    } catch (error) {
      console.error("DuckDuckGo API Error:", error);
      return await this.sendMessageMock(messages);
    }
  }

  /**
   * Mock AI response for testing (COMPLETELY FREE)
   * Provides intelligent-looking responses without any API calls
   */
  static async sendMessageMock(messages: IChatMessage[]): Promise<string> {
    const lastMessage =
      messages[messages.length - 1]?.content?.toLowerCase() || "";

    // Simulate API delay
    await new Promise((resolve) =>
      setTimeout(resolve, 1000 + Math.random() * 2000)
    );

    // Simple response logic based on keywords
    if (lastMessage.includes("hello") || lastMessage.includes("hi")) {
      return "Hello! I'm your AI assistant specializing in blockchain and cryptocurrency. How can I help you today?";
    }
    if (lastMessage.includes("how are you")) {
      return "I'm doing great, thank you for asking! I'm here to help you with blockchain, cryptocurrency, and other questions.";
    }

    // Blockchain/Crypto specific responses
    if (lastMessage.includes("bitcoin") || lastMessage.includes("btc")) {
      return "Bitcoin is the first and largest cryptocurrency by market cap. It's a decentralized digital currency that operates on a peer-to-peer network using blockchain technology. Would you like to know more about any specific aspect of Bitcoin?";
    }
    if (lastMessage.includes("ethereum") || lastMessage.includes("eth")) {
      return "Ethereum is a decentralized platform that enables smart contracts and decentralized applications (dApps). It has its own cryptocurrency called Ether (ETH) and supports various DeFi protocols. What would you like to know about Ethereum?";
    }
    if (lastMessage.includes("blockchain")) {
      return "Blockchain is a distributed ledger technology that maintains a continuously growing list of records (blocks) linked using cryptography. It's the underlying technology behind cryptocurrencies and has applications in supply chain, healthcare, and more.";
    }
    if (lastMessage.includes("smart contract")) {
      return "Smart contracts are self-executing contracts with terms directly written into code. They automatically execute when predetermined conditions are met, eliminating the need for intermediaries. They're primarily used on platforms like Ethereum.";
    }
    if (
      lastMessage.includes("defi") ||
      lastMessage.includes("decentralized finance")
    ) {
      return "DeFi (Decentralized Finance) refers to financial services built on blockchain networks, primarily Ethereum. It includes lending, borrowing, trading, and yield farming without traditional intermediaries like banks.";
    }
    if (lastMessage.includes("nft")) {
      return "NFTs (Non-Fungible Tokens) are unique digital assets stored on blockchain networks. They represent ownership of digital or physical items and have gained popularity in art, gaming, and collectibles.";
    }
    if (
      lastMessage.includes("mining") ||
      lastMessage.includes("proof of work")
    ) {
      return "Cryptocurrency mining is the process of validating transactions and adding them to the blockchain. Miners compete to solve complex mathematical problems, and the first to solve it gets rewarded with cryptocurrency.";
    }
    if (lastMessage.includes("wallet")) {
      return "A cryptocurrency wallet is a digital tool that allows you to store, send, and receive cryptocurrencies. There are hot wallets (connected to internet) and cold wallets (offline storage) for different security needs.";
    }

    if (lastMessage.includes("weather")) {
      return "I don't have access to real-time weather data, but I'd recommend checking a weather app or website for the most accurate information!";
    }
    if (lastMessage.includes("time")) {
      return `The current time is ${new Date().toLocaleTimeString()}. Is there anything else I can help you with?`;
    }
    if (lastMessage.includes("joke")) {
      const jokes = [
        "Why don't scientists trust atoms? Because they make up everything!",
        "I told my wife she was drawing her eyebrows too high. She looked surprised.",
        "Why don't programmers like nature? It has too many bugs!",
        "Why did the Bitcoin break up with the Dollar? Because it wanted a decentralized relationship!",
        "What do you call a blockchain developer who doesn't test their code? A smart contract risk!",
      ];
      return jokes[Math.floor(Math.random() * jokes.length)];
    }

    // Generic helpful responses with blockchain focus
    const responses = [
      "That's an interesting question! In the blockchain space, there are many perspectives on this topic.",
      "I understand what you're asking. This relates to some important concepts in cryptocurrency and blockchain technology.",
      "That's a great point! The decentralized nature of blockchain makes this topic particularly fascinating.",
      "Thanks for sharing that with me. I'm here to help with blockchain, crypto, and other questions!",
      "I appreciate you asking! This touches on some key principles in the cryptocurrency ecosystem.",
      "Interesting question! The blockchain industry is constantly evolving, and this is definitely worth exploring.",
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  }

  /**
   * Send a message to OpenAI and get a response (REQUIRES API KEY & PAYMENT)
   * Using GPT-3.5-turbo which is the most cost-effective model
   */
  static async sendMessage(messages: IChatMessage[]): Promise<string> {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo", // Most cost-effective model
        messages: messages,
        max_tokens: 1000,
        temperature: 0.7,
      });

      return (
        response.choices[0]?.message?.content ||
        "Sorry, I could not generate a response."
      );
    } catch (error) {
      console.error("OpenAI API Error:", error);

      if (error instanceof Error) {
        // Handle specific error types
        if (error.message.includes("API key")) {
          throw new Error("Please check your OpenAI API key configuration.");
        }
        if (error.message.includes("quota")) {
          throw new Error(
            "API quota exceeded. Please check your OpenAI account billing."
          );
        }
        if (error.message.includes("rate limit")) {
          throw new Error("Rate limit exceeded. Please try again in a moment.");
        }
      }

      throw new Error("Failed to get response from OpenAI. Please try again.");
    }
  }

  /**
   * Alternative method using GPT-4o-mini which is even more cost-effective
   */
  static async sendMessageWithGPT4Mini(
    messages: IChatMessage[]
  ): Promise<string> {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini", // Even more cost-effective than GPT-3.5-turbo
        messages: messages,
        max_tokens: 1000,
        temperature: 0.7,
      });

      return (
        response.choices[0]?.message?.content ||
        "Sorry, I could not generate a response."
      );
    } catch (error) {
      console.error("OpenAI API Error:", error);
      throw new Error("Failed to get response from OpenAI. Please try again.");
    }
  }

  /**
   * Send a streaming message to OpenAI and get a response (REQUIRES API KEY & PAYMENT)
   * Calls onChunk for each token received
   */
  static async sendMessageStreaming(
    messages: IChatMessage[],
    onChunk: (chunk: string) => void
  ): Promise<string> {
    try {
      const stream = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: messages,
        max_tokens: 1000,
        temperature: 0.7,
        stream: true,
      });

      let fullResponse = "";

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || "";
        if (content) {
          fullResponse += content;
          onChunk(content);
        }
      }

      return fullResponse;
    } catch (error) {
      console.error("OpenAI Streaming API Error:", error);

      if (error instanceof Error) {
        if (error.message.includes("API key")) {
          throw new Error("Please check your OpenAI API key configuration.");
        }
        if (error.message.includes("quota")) {
          throw new Error(
            "API quota exceeded. Please check your OpenAI account billing."
          );
        }
        if (error.message.includes("rate limit")) {
          throw new Error("Rate limit exceeded. Please try again in a moment.");
        }
      }

      throw new Error(
        "Failed to get streaming response from OpenAI. Please try again."
      );
    }
  }

  /**
   * Mock streaming response for testing (COMPLETELY FREE)
   * Simulates streaming by sending chunks with delays
   */
  static async sendMessageMockStreaming(
    messages: IChatMessage[],
    onChunk: (chunk: string) => void
  ): Promise<string> {
    const lastMessage =
      messages[messages.length - 1]?.content?.toLowerCase() || "";

    // Get the full response first
    let fullResponse = "";

    // Simple response logic based on keywords (same as non-streaming version)
    if (lastMessage.includes("hello") || lastMessage.includes("hi")) {
      fullResponse =
        "Hello! I'm your AI assistant specializing in blockchain and cryptocurrency. How can I help you today?";
    } else if (lastMessage.includes("how are you")) {
      fullResponse =
        "I'm doing great, thank you for asking! I'm here to help you with blockchain, cryptocurrency, and other questions.";
    } else if (lastMessage.includes("bitcoin") || lastMessage.includes("btc")) {
      fullResponse =
        "Bitcoin is the first and largest cryptocurrency by market cap. It's a decentralized digital currency that operates on a peer-to-peer network using blockchain technology. Would you like to know more about any specific aspect of Bitcoin?";
    } else if (
      lastMessage.includes("ethereum") ||
      lastMessage.includes("eth")
    ) {
      fullResponse =
        "Ethereum is a decentralized platform that enables smart contracts and decentralized applications (dApps). It has its own cryptocurrency called Ether (ETH) and supports various DeFi protocols. What would you like to know about Ethereum?";
    } else if (lastMessage.includes("blockchain")) {
      if (lastMessage.includes("code") || lastMessage.includes("example")) {
        fullResponse = `Here's a simple example of a blockchain implementation in Python:

\`\`\`python
import hashlib
import json
from time import time

class Blockchain:
    def __init__(self):
        self.chain = []
        self.pending_transactions = []
        self.create_genesis_block()
    
    def create_genesis_block(self):
        genesis_block = {
            'index': 0,
            'timestamp': time(),
            'transactions': [],
            'previous_hash': '0',
            'nonce': 0
        }
        genesis_block['hash'] = self.hash(genesis_block)
        self.chain.append(genesis_block)
    
    def create_block(self, previous_hash):
        block = {
            'index': len(self.chain),
            'timestamp': time(),
            'transactions': self.pending_transactions,
            'previous_hash': previous_hash,
            'nonce': 0
        }
        block['hash'] = self.hash(block)
        self.chain.append(block)
        self.pending_transactions = []
        return block
    
    def hash(self, block):
        encoded_block = json.dumps(block, sort_keys=True).encode()
        return hashlib.sha256(encoded_block).hexdigest()
    
    def add_transaction(self, sender, receiver, amount):
        transaction = {
            'sender': sender,
            'receiver': receiver,
            'amount': amount
        }
        self.pending_transactions.append(transaction)
    
    def get_balance(self, address):
        balance = 0
        for block in self.chain:
            for transaction in block['transactions']:
                if transaction['sender'] == address:
                    balance -= transaction['amount']
                if transaction['receiver'] == address:
                    balance += transaction['amount']
        return balance

# Usage example
blockchain = Blockchain()
blockchain.add_transaction('Alice', 'Bob', 50)
blockchain.create_block(blockchain.chain[-1]['hash'])
print(f"Bob's balance: {blockchain.get_balance('Bob')}")
\`\`\`

This is a basic blockchain implementation that includes:
- **Block creation** with hash linking
- **Transaction management**
- **Balance calculation**
- **Genesis block** initialization

You can extend this with features like proof-of-work, digital signatures, and network consensus mechanisms.`;
      } else {
        fullResponse =
          "Blockchain is a distributed ledger technology that maintains a continuously growing list of records (blocks) linked using cryptography. It's the underlying technology behind cryptocurrencies and has applications in supply chain, healthcare, and more.";
      }
    } else if (lastMessage.includes("smart contract")) {
      if (lastMessage.includes("code") || lastMessage.includes("example")) {
        fullResponse = `Here's a simple smart contract example in Solidity:

\`\`\`solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleStorage {
    uint256 private storedData;
    address public owner;
    
    event DataChanged(uint256 newValue, address changedBy);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    constructor() {
        owner = msg.sender;
        storedData = 0;
    }
    
    function set(uint256 x) public onlyOwner {
        storedData = x;
        emit DataChanged(x, msg.sender);
    }
    
    function get() public view returns (uint256) {
        return storedData;
    }
    
    function increment() public onlyOwner {
        storedData += 1;
        emit DataChanged(storedData, msg.sender);
    }
}
\`\`\`

This smart contract demonstrates:
- **State variables** (\`storedData\`, \`owner\`)
- **Access control** with \`onlyOwner\` modifier
- **Events** for logging changes
- **Functions** to read and write data
- **Constructor** for initialization

Smart contracts are immutable once deployed and execute automatically when conditions are met!`;
      } else {
        fullResponse =
          "Smart contracts are self-executing contracts with terms directly written into code. They automatically execute when predetermined conditions are met, eliminating the need for intermediaries. They're primarily used on platforms like Ethereum.";
      }
    } else if (
      lastMessage.includes("defi") ||
      lastMessage.includes("decentralized finance")
    ) {
      fullResponse =
        "DeFi (Decentralized Finance) refers to financial services built on blockchain networks, primarily Ethereum. It includes lending, borrowing, trading, and yield farming without traditional intermediaries like banks.";
    } else if (lastMessage.includes("nft")) {
      fullResponse =
        "NFTs (Non-Fungible Tokens) are unique digital assets stored on blockchain networks. They represent ownership of digital or physical items and have gained popularity in art, gaming, and collectibles.";
    } else if (
      lastMessage.includes("mining") ||
      lastMessage.includes("proof of work")
    ) {
      fullResponse =
        "Cryptocurrency mining is the process of validating transactions and adding them to the blockchain. Miners compete to solve complex mathematical problems, and the first to solve it gets rewarded with cryptocurrency.";
    } else if (lastMessage.includes("wallet")) {
      fullResponse =
        "A cryptocurrency wallet is a digital tool that allows you to store, send, and receive cryptocurrencies. There are hot wallets (connected to internet) and cold wallets (offline storage) for different security needs.";
    } else if (lastMessage.includes("weather")) {
      fullResponse =
        "I don't have access to real-time weather data, but I'd recommend checking a weather app or website for the most accurate information!";
    } else if (lastMessage.includes("time")) {
      fullResponse = `The current time is ${new Date().toLocaleTimeString()}. Is there anything else I can help you with?`;
    } else if (lastMessage.includes("joke")) {
      const jokes = [
        "Why don't scientists trust atoms? Because they make up everything!",
        "I told my wife she was drawing her eyebrows too high. She looked surprised.",
        "Why don't programmers like nature? It has too many bugs!",
        "Why did the Bitcoin break up with the Dollar? Because it wanted a decentralized relationship!",
        "What do you call a blockchain developer who doesn't test their code? A smart contract risk!",
      ];
      fullResponse = jokes[Math.floor(Math.random() * jokes.length)];
    } else {
      // Generic helpful responses with blockchain focus
      const responses = [
        "That's an interesting question! In the blockchain space, there are many perspectives on this topic.",
        "I understand what you're asking. This relates to some important concepts in cryptocurrency and blockchain technology.",
        "That's a great point! The decentralized nature of blockchain makes this topic particularly fascinating.",
        "Thanks for sharing that with me. I'm here to help with blockchain, crypto, and other questions!",
        "I appreciate you asking! This touches on some key principles in the cryptocurrency ecosystem.",
        "Interesting question! The blockchain industry is constantly evolving, and this is definitely worth exploring.",
      ];
      fullResponse = responses[Math.floor(Math.random() * responses.length)];
    }

    // Simulate streaming by sending chunks
    const words = fullResponse.split(" ");

    for (let i = 0; i < words.length; i++) {
      const word = words[i] + (i < words.length - 1 ? " " : "");
      onChunk(word);

      // Add realistic delay between words (30-100ms)
      await new Promise((resolve) =>
        setTimeout(resolve, 30 + Math.random() * 70)
      );
    }

    return fullResponse;
  }

  /**
   * Master method to send messages using different AI providers with streaming support
   * Automatically falls back to free options if OpenAI fails
   */
  static async sendMessageWithProvider(
    messages: IChatMessage[],
    provider: AIProvider = "duckduckgo"
  ): Promise<string> {
    try {
      switch (provider) {
        case "openai":
          // Only try OpenAI if we have an API key
          if (
            import.meta.env.VITE_OPENAI_API_KEY &&
            import.meta.env.VITE_OPENAI_API_KEY !== "dummy-key"
          ) {
            return await this.sendMessage(messages);
          }
          // Fall back to free option if no API key
          return await this.sendMessageDuckDuckGo(messages);

        case "duckduckgo":
          return await this.sendMessageDuckDuckGo(messages);

        case "local":
          return await this.sendMessageMock(messages);

        default:
          return await this.sendMessageDuckDuckGo(messages);
      }
    } catch (error) {
      console.error(`Error with ${provider} provider:`, error);

      // Try fallback providers
      if (provider === "openai") {
        console.log("OpenAI failed, trying DuckDuckGo...");
        try {
          return await this.sendMessageDuckDuckGo(messages);
        } catch {
          console.log("DuckDuckGo failed, using mock responses...");
          return await this.sendMessageMock(messages);
        }
      } else if (provider === "duckduckgo") {
        console.log("DuckDuckGo failed, using mock responses...");
        return await this.sendMessageMock(messages);
      }

      throw error;
    }
  }

  /**
   * Master method for streaming responses with different AI providers
   * Automatically falls back to free options if OpenAI fails
   */
  static async sendMessageWithProviderStreaming(
    messages: IChatMessage[],
    onChunk: (chunk: string) => void,
    provider: AIProvider = "local"
  ): Promise<string> {
    try {
      switch (provider) {
        case "openai":
          // Only try OpenAI if we have an API key
          if (
            import.meta.env.VITE_OPENAI_API_KEY &&
            import.meta.env.VITE_OPENAI_API_KEY !== "dummy-key"
          ) {
            return await this.sendMessageStreaming(messages, onChunk);
          }
          // Fall back to mock streaming if no API key
          return await this.sendMessageMockStreaming(messages, onChunk);

        case "duckduckgo": {
          // DuckDuckGo doesn't support streaming, so we'll get the full response and simulate streaming
          const response = await this.sendMessageDuckDuckGo(messages);
          const words = response.split(" ");
          for (let i = 0; i < words.length; i++) {
            const word = words[i] + (i < words.length - 1 ? " " : "");
            onChunk(word);
            await new Promise((resolve) =>
              setTimeout(resolve, 50 + Math.random() * 50)
            );
          }
          return response;
        }

        case "local":
          return await this.sendMessageMockStreaming(messages, onChunk);

        default:
          return await this.sendMessageMockStreaming(messages, onChunk);
      }
    } catch (error) {
      console.error(`Error with ${provider} provider:`, error);

      // Try fallback providers
      if (provider === "openai") {
        console.log("OpenAI failed, trying mock streaming...");
        return await this.sendMessageMockStreaming(messages, onChunk);
      } else if (provider === "duckduckgo") {
        console.log("DuckDuckGo failed, using mock streaming...");
        return await this.sendMessageMockStreaming(messages, onChunk);
      }

      throw error;
    }
  }
}

// Keep backward compatibility
export const OpenAIService = AIService;
