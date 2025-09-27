# Crypto AI Chat Assistant

A modern, responsive AI-powered chat application specialized in cryptocurrency, blockchain technology. Built with React, TypeScript, and Vite, featuring a rich text editor and seamless OpenAI integration.

## ✨ Features

- 🤖 **AI-Powered Responses** - Specialized in crypto, blockchain, DeFi, NFTs, and Web3
- 📝 **Rich Text Editor** - Format messages with bold, italic, headings, and lists
- 😊 **Emoji Support** - Built-in emoji picker for expressive conversations
- 💾 **Persistent Chat History** - Conversations saved locally in your browser
- 🔐 **Secure API Key Management** - Your OpenAI API key stored locally, never sent to servers
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- 🎨 **Modern UI** - Beautiful, intuitive interface with smooth animations
- ⚡ **Real-time Streaming** - See AI responses as they're generated

## 🚀 Quick Start

### Prerequisites

- **Node.js** (version 20.19+ or 22.12+) - _Required by Vite_
- **npm** or **yarn**
- **OpenAI API Key** (optional, but required for AI responses)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd merkle-science-assignment
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 🔑 Setting Up Your OpenAI API Key

### Getting Your API Key

1. **Visit OpenAI Platform**
   Go to [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)

2. **Sign In**
   Log in to your OpenAI account (create one if needed)

3. **Create API Key**
   - Click "Create new secret key"
   - Give it a name (e.g., "Crypto Chat App")
   - Copy the generated key (starts with `sk-`)

### Adding Your API Key to the App

1. **Open the Application**
   Launch the app in your browser

2. **Navigate to Settings**

   - Click the hamburger menu (☰) in the top-left corner
   - Select "Settings" from the sidebar

3. **Enter Your API Key**

   - Paste your OpenAI API key in the input field
   - Click "Save API Key"
   - You should see "API Key Configured" status

4. **Start Chatting**
   - Navigate back to the chat (click "Home" in sidebar)
   - Your messages will now get real AI responses!

### Without API Key

If you don't have an OpenAI API key, the app will still work with:

- Mock AI responses for demonstration
- Full rich text editing capabilities
- Chat history and all UI features

## 📖 How to Use

### Basic Chat

1. **Start a Conversation**

   - Type your message in the rich text editor at the bottom
   - Press the send button (→) to send

2. **Ask About Crypto Topics**
   The AI is specialized in:
   - Cryptocurrency fundamentals
   - Blockchain technology
   - DeFi protocols and strategies
   - NFT markets and trends
   - Web3 development
   - Smart contracts
   - Trading strategies
   - Regulatory updates

### Rich Text Formatting

**Toolbar Options:**

- **Bold** - Make text bold
- **Italic** - Make text italic
- **Underline** - Underline text
- **Headings** - Create H1 and H2 headings
- **Lists** - Add bullet points or numbered lists
- **Emojis** - Insert emojis with the picker

**Keyboard Shortcuts:**

- `Ctrl/Cmd + B` - Bold
- `Ctrl/Cmd + I` - Italic
- `Ctrl/Cmd + U` - Underline

### Managing Conversations

- **Multiple Chats** - Each conversation is automatically saved
- **Chat History** - Access previous conversations from the sidebar
- **Persistent Storage** - All chats saved in your browser's local storage

## 🛠️ Development

### Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Rich Text**: Lexical Editor Framework
- **Routing**: React Router v7
- **Icons**: React Icons
- **AI Integration**: OpenAI API

### Project Structure

```
src/
├── components/          # React components
│   ├── Chat.tsx        # Main chat interface
│   ├── RichTextEditor.tsx  # Rich text editor
│   ├── Settings.tsx    # API key management
│   └── ...
├── contexts/           # React contexts
│   ├── ApiKeyContext.tsx   # API key management
│   └── apiKeyTypes.ts
├── hooks/              # Custom React hooks
├── services/           # API services
│   └── openai.ts      # OpenAI integration
├── utils/              # Utility functions
└── global/             # Global types and constants
```

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
```

### Environment Variables

No environment variables are required! The app uses user-provided API keys stored locally for maximum security and flexibility.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Getting Help

If you encounter issues:

1. Check the browser console for error messages
2. Verify your OpenAI API key is valid
3. Try clearing your browser's local storage
4. Refresh the page and try again

---
