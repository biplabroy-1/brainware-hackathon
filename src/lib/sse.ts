import { ReadableStream } from "stream/web";

interface SSEMessage {
  status: string;
  message: string;
  progress?: number;
  data?: any;
  type?: string;
}

export function createServerSentEventStream() {
  const encoder = new TextEncoder();

  // Initialize with no-op functions to avoid "used before assigned" errors
  let push: (message: SSEMessage) => void = () => {};
  let close: () => void = () => {};

  const stream = new ReadableStream({
    start(controller) {
      // Override the initial no-op functions with the real implementations
      push = (message: SSEMessage) => {
        const data = JSON.stringify(message);
        controller.enqueue(encoder.encode(`data: ${data}\n\n`));
      };

      close = () => {
        controller.close();
      };
    },
  });

  return { stream, push, close };
}
