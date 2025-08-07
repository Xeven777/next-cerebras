import { cerebras } from "@ai-sdk/cerebras";
import {
  convertToModelMessages,
  smoothStream,
  streamText,
  UIMessage,
} from "ai";

export const dynamic = "force-dynamic";
export const maxDuration = 35;

export async function POST(req: Request) {
  try {
    const {
      messages,
      selectedModel,
    }: {
      messages: UIMessage[];
      selectedModel: string;
    } = await req.json();

    console.log(selectedModel);

    const result = streamText({
      model: cerebras(selectedModel ?? "llama-3.3-70b"),
      system: "You are a helpful assistant",
      messages: convertToModelMessages(messages),
      maxRetries: 3,
      experimental_transform: smoothStream({
        chunking: "line",
        delayInMs: 10,
      }),
    });
    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.log(error);
    throw error;
  }
}
