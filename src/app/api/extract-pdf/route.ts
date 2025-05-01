import { NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import { createServerSentEventStream } from "@/lib/sse";
import fs from "node:fs";
import formidable from "formidable";
import { Readable } from "stream";
import { IncomingMessage } from "http";

export const runtime = "nodejs";

const apiKey = process.env.GOOGLE_API_KEY!;
const genAI = new GoogleGenerativeAI(apiKey);
const fileManager = new GoogleAIFileManager(apiKey);

export async function POST(req: NextRequest) {
  const sse = createServerSentEventStream();

  try {
    // Create a buffer from the request body
    const buffer = await req.arrayBuffer();
    const bufferData = Buffer.from(buffer);

    // Write the buffer to a temporary file
    const tempFilePath = `/tmp/upload-${Date.now()}.pdf`;
    fs.writeFileSync(tempFilePath, bufferData);

    sse.push({
      status: "uploading",
      message: "Uploading PDF to processing server...",
      progress: 5,
    });

    const uploadedFile = await fileManager.uploadFile(tempFilePath, {
      mimeType: "application/pdf",
      displayName: "uploaded-file.pdf",
    });

    sse.push({
      status: "uploaded",
      message: "PDF uploaded successfully",
      progress: 10,
    });

    await waitForFilesActive([uploadedFile], sse.push);

    sse.push({
      status: "analyzing",
      message: "Analyzing PDF content...",
      progress: 65,
    });

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-pro-exp-03-25",
      systemInstruction: fs.readFileSync("prompt.txt", "utf-8"),
    });

    // Use typesafe property access based on Google AI library's UploadFileResponse
    const fileData = {
      mimeType: "application/pdf",
      // Use type assertion to safely access property
      fileUri: (uploadedFile as any).fileUri || "",
    };

    const chat = model.startChat({
      generationConfig: {
        temperature: 1,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 65536,
      },
      history: [
        {
          role: "user",
          parts: [
            {
              fileData,
            },
          ],
        },
      ],
    });

    sse.push({
      status: "extracting",
      message: "Extracting information from PDF...",
      progress: 85,
    });

    const result = await chat.sendMessage("Dont cover it with ```json ```");
    const cleaned = result.response
      .text()
      .replace(/```json/g, "")
      .replace(/```/g, "");

    fs.unlinkSync(tempFilePath);

    try {
      const parsed = JSON.parse(cleaned);
      sse.push({
        status: "complete",
        message: "Extraction complete",
        progress: 100,
        data: parsed,
      });
    } catch {
      sse.push({
        status: "complete",
        message: "Extraction complete",
        progress: 100,
        data: cleaned,
        type: "text",
      });
    }

    sse.close();
  } catch (err: any) {
    sse.push({
      status: "error",
      message: `Error: ${err.message || err}`,
    });
    sse.close();
  }

  // Return a proper web-standard ReadableStream
  return new Response(sse.stream as unknown as ReadableStream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

async function waitForFilesActive(files: any[], push: (msg: any) => void) {
  push({ status: "processing", message: "Processing PDF...", progress: 15 });
  for (const file of files) {
    // Use the name property to identify the file
    let f = await fileManager.getFile((file as any).name);
    while (f.state === "PROCESSING") {
      await new Promise((r) => setTimeout(r, 2000));
      f = await fileManager.getFile((file as any).name);
      push({
        status: "processing",
        message: `Still processing file`,
        progress: Math.min(55, Math.random() * 40 + 15),
      });
    }
    if (f.state !== "ACTIVE") throw new Error(`File processing failed`);
  }
}
