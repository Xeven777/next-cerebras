# 🚀 Next.js + Cerebras AI Chat Application

A lightning-fast ⚡ chat interface powered by Cerebras's API and built with Next.js

## ✨ Features

- 🧠 Access to powerful LLMs through Cerebras's API
- 🔄 Real-time chat with multiple model options
- ⏱️ Response time tracking for performance insights
- 📱 Fully responsive design for all devices
- 🌙 Dark mode support for comfortable viewing
- 🤔 "Thinking" states to see model reasoning
- 📋 Easy text copying functionality
- 🔌 Simple integration with Next.js applications

## 🤖 Available Models

- ⚡ Llama 3.1 - 8B (`llama3.1-8b`)
- 🦙 Llama 3.3 - 70B (`llama-3.3-70b`)
- 🐦 Qwen 3 - 32B (`qwen-3-32b`)
- 🐦 Qwen 3 - 235B A22B Instruct 2507 (`qwen-3-235b-a22b-instruct-2507`)
- 🤖 GPT OSS - 120B (`gpt-oss-120b`)

## 🛠️ Getting Started

### Prerequisites

- Node.js 18.x or higher
- A Cerebras API key

### Installation

1. Clone the repository:

```bash
git clone https://github.com/xeven777/next-cerebras.git
cd next-cerebras
```

2. Install dependencies:

```bash
npm install
# or
yarn
# or
pnpm install
```

3. Create a `.env.local` file in the root directory:

```
CEREBRAS_API_KEY=your-api-key
```

4. Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Usage

1. 🔤 Type your message in the input field
2. 🔄 Select your preferred model from the dropdown
3. 🚀 Hit "Send" or press Enter
4. ⏱️ Watch as the AI responds with timing information

## 🔧 Customization

You can customize the application by:

- Adding new models to the `models` array in `Chatbox.tsx`
- Modifying the UI theme in your Tailwind configuration
- Adding new prompt suggestions for quick user interactions

## 👨‍💻 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🙏 Acknowledgements

- [Cerebras](https://inference.cerebras.ai/) for their powerful API
- [Next.js](https://nextjs.org/) for the React framework
- [Vercel AI SDK](https://sdk.vercel.ai/docs) for streaming capabilities
