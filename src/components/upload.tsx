import React, { useState, useRef, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import toast from "react-hot-toast";

interface UploadPDFModalProps {
  onUploadSuccess: (data: any) => void;
}

interface EventData {
  message?: string;
  status?: string;
  progress?: number;
  type?: string;
  data?: {
    status?: string;
    message?: string;
    type?: string;
    [key: string]: any;
  } | null;
}

export default function UploadPDFModal({ onUploadSuccess }: UploadPDFModalProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const eventSourceRef = useRef<EventSource | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0] || null;
    setFile(uploadedFile);
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setStatusMessage("Starting upload...");
    setProgress(10);

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }

      const response = await fetch("https://api.remindme.globaltfn.tech/api/extract-pdf", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const reader = response.body ? response.body.getReader() : null;
      if (!reader) {
        throw new Error('Response body is null');
      }
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.substring(6));
              handleEventData(data);
            } catch (e) {
              console.error("Error parsing SSE data:", e);
            }
          }
        }
      }
    } catch (error) {
      toast.error("Error uploading file!");
      console.error("Error uploading file:", error);
      setUploading(false);
    }
  };

  const handleEventData = (data: EventData) => {
    console.log("Received update:", data);

    if (data.message) {
      setStatusMessage(data.message);
      console.log(data.message);

      let newProgress = progress;
      switch (data.status) {
        case "uploading":
          newProgress = data.progress || progress;
          break;
        case "uploaded":
          newProgress = data.progress || progress;
          break;
        case "processing":
          newProgress = data.progress || progress;
          break;
        case "processed":
          newProgress = data.progress || progress;
          break;
        case "analyzing":
          newProgress = data.progress || progress;
          break;
        case "extracting":
          newProgress = data.progress || progress;
          break;
        case "finalizing":
          newProgress = data.progress || progress;
          break;
        case "extracted":
          newProgress = data.progress || progress;
          break;
        case "complete":
          newProgress = 100;
          if (data.status === "complete") {
            toast.success(data.message);
          } else {
            toast.error(data.message.substring(0, 30));
          }
          break;
        default:
          break;
      }

      setProgress(newProgress);
    }

    if (data.status === "complete") {
      console.log("This is the data", data);

      // Check if the data contains a non-timetable message
      if (data.type === "text" && typeof data.data === 'string') {
        console.log("Received non-timetable data");
        toast.error("Please upload a valid academic timetable");
        setUploading(false);
        setOpen(false);
        setFile(null);
        setProgress(0);
        setStatusMessage("");
        return; // Exit early without calling onUploadSuccess
      }

      if (data.data && (data.data.status === "error" || data.data.type === "text")) {
        console.log("error");
        toast.error(data.data.message || "Unknown error");
        setUploading(false);
      } else if (onUploadSuccess && data.data) {
        onUploadSuccess(data.data);
      }

      setTimeout(() => {
        setUploading(false);
        setOpen(false);
        setFile(null);
        setProgress(0);
        setStatusMessage("");
      }, 1000);
    } else if (data.status === "error") {
      setUploading(false);
    }
  };

  return (
    <>
      <Button className="cursor-pointer" onClick={() => setOpen(true)}>
        Upload PDF
      </Button>
      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          if (!uploading) setOpen(isOpen);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload PDF</DialogTitle>
          </DialogHeader>
          {!uploading ? (
            <input
              className="p-4 border rounded-2xl border-dashed"
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
            />
          ) : (
            <div className="space-y-4">
              <Progress value={progress} />
              <p className="text-center text-sm text-gray-500">
                {statusMessage}
              </p>
            </div>
          )}
          <div className="flex justify-end mt-4">
            {!uploading && (
              <Button
                onClick={handleUpload}
                disabled={!file}
                className="ml-2"
              >
                Upload
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
