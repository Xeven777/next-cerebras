"use client";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkBreaks from "remark-breaks";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import cerebraspic from "@/assets/cerebras.jpeg";
import sparkles from "@/assets/Sparkle.svg";
import send from "@/assets/send.svg";
import robo from "@/assets/Robo.svg";
import copy from "@/assets/copy.svg";

export function ChatSession({
  model,
  userIp,
  input,
  setInput,
  modelControls,
}: {
  model: string;
  userIp: string;
  input: string;
  setInput: (v: string) => void;
  modelControls?: React.ReactNode;
}) {
  const [responseTimes, setResponseTimes] = useState<Record<string, number>>(
    {}
  );
  const startTimeRef = useRef<number>(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        body: { selectedModel: model },
      }),
    [model]
  );

  const { messages, status, error, sendMessage } = useChat({
    transport,
    onFinish: ({ message }) => {
      const duration = (Date.now() - startTimeRef.current) / 1000;
      setResponseTimes((prev) => ({ ...prev, [message.id]: duration }));
    },
  });

  const isLoading = status === "streaming";

  const handleSubmit = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault();
      if (!input.trim()) return;
      startTimeRef.current = Date.now();
      sendMessage({ parts: [{ type: "text", text: input.trim() }] });
      setInput("");
    },
    [input, sendMessage, setInput]
  );

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  return (
    <>
      <div className="flex-1 overflow-y-auto rounded-xl bg-zinc-200 p-4 text-sm leading-6 text-zinc-900 dark:bg-zinc-800/40 dark:text-zinc-300 sm:text-base sm:leading-7 border border-red-600/20 h-full">
        {messages.length > 0 ? (
          messages.map((m) => (
            <div key={m.id} className="whitespace-pre-wrap">
              {m.role === "user" ? (
                <div className="flex flex-row px-2 py-4 sm:px-4">
                  <img
                    alt="user"
                    className="mr-2 flex size-6 md:size-8 rounded-full sm:mr-4"
                    src={getAvatarUrl(userIp)}
                    width={32}
                    height={32}
                  />
                  <div className="flex max-w-3xl items-center">
                    <p>
                      {m.parts.map((part) =>
                        part.type === "text" ? part.text : null
                      )}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mb-4 flex rounded-xl bg-zinc-50 px-2 py-6 dark:bg-zinc-900 sm:px-4 relative">
                  <Image
                    alt="model"
                    className="mr-2 flex size-6 md:size-8 rounded-full sm:mr-4"
                    src={cerebraspic}
                    placeholder="blur"
                    width={32}
                    height={32}
                  />
                  <div className="max-w-3xl rounded-xl markdown-body w-full overflow-x-auto">
                    {m.parts.map((part) => {
                      if (part.type === "reasoning") {
                        return (
                          <div
                            key={`${m.id}-reasoning`}
                            className="text-sm mb-3 p-3 border rounded-lg bg-zinc-100 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400 border-none"
                          >
                            <p className="text-red-500 animate-pulse p-1">
                              Thinking...
                            </p>
                            <Markdown
                              remarkPlugins={[
                                remarkGfm,
                                remarkMath,
                                remarkBreaks,
                              ]}
                              rehypePlugins={[rehypeKatex, rehypeHighlight]}
                              components={{
                                table: ({ children }) => (
                                  <div className="overflow-x-auto my-4">
                                    <table className="min-w-full">
                                      {children}
                                    </table>
                                  </div>
                                ),
                              }}
                            >
                              {part.text}
                            </Markdown>
                          </div>
                        );
                      }
                      if (part.type === "text") {
                        const parsed = parseThinkingContent(part.text);
                        return (
                          <div key={`${m.id}-text`}>
                            {parsed.hasReasoning &&
                              parsed.reasoning.map((reasoningText, index) => (
                                <div
                                  key={`${m.id}-parsed-reasoning-${index}`}
                                  className="text-sm mb-3 p-3 border rounded-lg bg-zinc-100 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400 border-none"
                                >
                                  <p className="text-red-500 animate-pulse p-1">
                                    Thinking...
                                  </p>
                                  <Markdown
                                    remarkPlugins={[
                                      remarkGfm,
                                      remarkMath,
                                      remarkBreaks,
                                    ]}
                                    rehypePlugins={[
                                      rehypeKatex,
                                      rehypeHighlight,
                                    ]}
                                    components={{
                                      table: ({ children }) => (
                                        <div className="overflow-x-auto my-4">
                                          <table className="min-w-full">
                                            {children}
                                          </table>
                                        </div>
                                      ),
                                    }}
                                  >
                                    {reasoningText}
                                  </Markdown>
                                </div>
                              ))}
                            {parsed.cleanText && (
                              <Markdown
                                remarkPlugins={[
                                  remarkGfm,
                                  remarkMath,
                                  remarkBreaks,
                                ]}
                                rehypePlugins={[rehypeKatex, rehypeHighlight]}
                                components={{
                                  table: ({ children }) => (
                                    <div className="overflow-x-auto my-4">
                                      <table className="min-w-full">
                                        {children}
                                      </table>
                                    </div>
                                  ),
                                }}
                              >
                                {parsed.cleanText}
                              </Markdown>
                            )}
                          </div>
                        );
                      }
                      return null;
                    })}
                    {responseTimes[m.id] && (
                      <div className="text-xs text-zinc-500 mt-2">
                        Response time: {responseTimes[m.id].toFixed(3)}s
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    title="copy"
                    className="absolute top-2 right-2 p-1 rounded-full bg-red-500 dark:bg-zinc-800 transition-all active:scale-95 opacity-50 hover:opacity-75"
                    onClick={() => {
                      const textContent = m.parts
                        .filter((part) => part.type === "text")
                        .map((part) => {
                          const parsed = parseThinkingContent(part.text);
                          return parsed.cleanText || part.text;
                        })
                        .join("");
                      navigator.clipboard.writeText(textContent);
                      alert("Copied to clipboard");
                    }}
                  >
                    <Image src={copy} alt="copy" width={19} />
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-xl md:text-2xl px-2 font-semibold text-center mx-auto text-zinc-500 dark:text-zinc-400 tracking-wide">
              Start Chatting with
              <br />
              <span className="text-red-500 text-2xl md:text-4xl">
                Cerebras
              </span>{" "}
              .AI Now!
            </p>
            <Image
              src={robo}
              id="pic"
              alt="ROBO"
              width={300}
              className="hover:scale-110 mt-6 transition-all duration-500 active:scale-95"
            />
          </div>
        )}
        {isLoading && (
          <div className="flex items-center gap-2 px-10">
            <Image
              src={sparkles}
              alt="Loading"
              width={22}
              className="animate-pulse"
            />
            <span className="text-red-500 animate-pulse">Generating...</span>
          </div>
        )}
        {error && (
          <p className="text-red-500">Something went wrong! Try Again</p>
        )}
        <div ref={messagesEndRef} />
      </div>

      {modelControls && <div className="mt-2">{modelControls}</div>}

      {/* Input */}
      <form className="mt-2" onSubmit={handleSubmit}>
        <div className="relative">
          <textarea
            id="chat-input"
            className="block caret-red-600 w-full rounded-xl border-none bg-zinc-200 p-4 pl-2 pr-20 text-sm text-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-red-500 dark:bg-zinc-800 dark:text-zinc-200 sm:text-base resize-y"
            placeholder="Enter your prompt"
            rows={1}
            value={input}
            required
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="absolute bottom-2 right-2.5 rounded-lg px-4 py-2 text-sm font-medium text-zinc-200 bg-red-600 hover:bg-red-700 dark:focus:ring-red-800 sm:text-base flex items-center gap-2 active:scale-95 transition-all"
          >
            {isLoading ? (
              <>
                Generating
                <Image
                  src={sparkles}
                  alt="loading"
                  width={22}
                  className="animate-pulse"
                />
              </>
            ) : (
              <>
                Send <Image src={send} alt="" width={20} />
              </>
            )}
          </button>
        </div>
      </form>
    </>
  );
}

function getAvatarUrl(ip: string): string {
  const encodedIp = encodeURIComponent(ip);
  return `https://xvatar.vercel.app/api/avatar/${encodedIp}?rounded=120&size=240&userLogo=true`;
}

export function parseThinkingContent(text: string) {
  const thinkingRegex = /<think>([\s\S]*?)<\/think>/gi;
  const matches = [];
  let match;
  let cleanedText = text;

  while ((match = thinkingRegex.exec(text)) !== null) {
    matches.push({
      type: "reasoning" as const,
      text: match[1].trim(),
      startIndex: match.index,
      endIndex: match.index + match[0].length,
    });
  }

  cleanedText = text.replace(thinkingRegex, "").trim();

  return {
    reasoning: matches.map((m) => m.text),
    cleanText: cleanedText,
    hasReasoning: matches.length > 0,
  };
}
