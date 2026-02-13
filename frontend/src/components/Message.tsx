"use client";

import { useEffect } from "react";

interface MessageProps {
  text: string;
  type: "success" | "error";
  onDismiss: () => void;
}

export default function Message({ text, type, onDismiss }: MessageProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 3000);
    return () => clearTimeout(timer);
  }, [text, onDismiss]);

  return (
    <div
      className={`p-4 rounded-lg mb-5 text-sm ${
        type === "success"
          ? "bg-green-100 text-green-800 border border-green-200"
          : "bg-red-100 text-red-800 border border-red-200"
      }`}
    >
      {text}
    </div>
  );
}
