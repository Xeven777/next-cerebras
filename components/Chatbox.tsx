"use client";
import { memo, useCallback, useState } from "react";
import { models } from "@/lib/model";
import { ChatSession } from "./ChatSession";

const Chatbox = memo(({ userIp }: { userIp: string }) => {
  const [selectedModel, setSelectedModel] = useState(
    "llama-4-scout-17b-16e-instruct"
  );
  const [input, setInput] = useState("");

  const handleModelChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedModel(event.target.value);
    },
    []
  );

  const handleSuggestionClick = useCallback((suggestion: string) => {
    setInput(suggestion);
  }, []);

  return (
    <div className="flex pb-0.5 h-svh w-full flex-col max-w-5xl mx-auto">
      {/* Chat Session */}
      <ChatSession
        key={selectedModel}
        model={selectedModel}
        userIp={userIp}
        input={input}
        setInput={setInput}
        modelControls={
          <div className="flex w-full gap-x-2 overflow-x-auto whitespace-nowrap text-xs text-zinc-600 dark:text-zinc-300 sm:text-sm scrollbar-hide shrink-0">
            <select
              name="model"
              title="Select Model"
              id="model-select"
              className="block w-full min-w-44 rounded-xl border-none bg-zinc-200 p-4 text-sm text-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-red-500 dark:bg-zinc-800 dark:text-zinc-200 dark:focus:ring-red-500 sm:text-base"
              value={selectedModel}
              onChange={handleModelChange}
            >
              {models.map((model) => (
                <option key={model.value} value={model.value}>
                  {model.label}
                </option>
              ))}
            </select>

            <button
              onClick={() =>
                window.open("https://img-gen7.netlify.app/", "_blank")
              }
              className="rounded-lg hover:bg-linear-to-br from-red-600 to-rose-600 p-2 hover:text-white transition-all active:scale-105 border border-red-600 font-semibold"
            >
              Generate Image ✨
            </button>

            <button
              onClick={() =>
                handleSuggestionClick("Make it Shorter and simpler.")
              }
              className="rounded-lg bg-zinc-200 p-2 hover:bg-red-600 hover:text-zinc-200 dark:bg-zinc-800 dark:hover:bg-red-600 dark:hover:text-zinc-50 transition-all active:scale-105"
            >
              Make Shorter
            </button>
            <button
              onClick={() =>
                handleSuggestionClick("Make it longer. explain it nicely")
              }
              className="rounded-lg bg-zinc-200 p-2 hover:bg-red-600 hover:text-zinc-200 dark:bg-zinc-800 dark:hover:bg-red-600 dark:hover:text-zinc-50 transition-all active:scale-105"
            >
              Make Longer
            </button>
            <button
              onClick={() =>
                handleSuggestionClick("Write it in a more professional tone.")
              }
              className="rounded-lg bg-zinc-200 p-2 hover:bg-red-600 hover:text-zinc-200 dark:bg-zinc-800 dark:hover:bg-red-600 dark:hover:text-zinc-50 transition-all active:scale-105"
            >
              More Professional
            </button>
            <button
              onClick={() =>
                handleSuggestionClick(
                  "Write it in a more casual and light tone."
                )
              }
              className="rounded-lg bg-zinc-200 p-2 hover:bg-red-600 hover:text-zinc-200 dark:bg-zinc-800 dark:hover:bg-red-600 dark:hover:text-zinc-50 transition-all active:scale-105"
            >
              More Casual
            </button>
            <button
              onClick={() => handleSuggestionClick("Paraphrase it")}
              className="rounded-lg bg-zinc-200 p-2 hover:bg-red-600 hover:text-zinc-200 dark:bg-zinc-800 dark:hover:bg-red-600 dark:hover:text-zinc-50 transition-all active:scale-105"
            >
              Paraphrase
            </button>
          </div>
        }
      />
    </div>
  );
});

export default Chatbox;
