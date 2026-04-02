"use client";

import { useSpeech } from "@/hooks/useSpeech";

interface Props {
  text: string;
  label?: string;
  size?: "sm" | "md";
}

export default function PronunciationButton({
  text,
  label,
  size = "md",
}: Props) {
  const { supported, speaking, error, speakText, stop } = useSpeech();

  const sizeClasses =
    size === "sm" ? "px-2 py-1 text-xs" : "px-3 py-1.5 text-sm";

  if (!supported) {
    return (
      <span className="text-xs text-gray-400" aria-label="音声再生非対応">
        🔇 音声非対応
      </span>
    );
  }

  return (
    <button
      onClick={() => (speaking ? stop() : speakText(text))}
      className={`inline-flex items-center gap-1 ${sizeClasses} rounded-lg font-medium transition-colors
        ${
          speaking
            ? "bg-red-100 text-red-700 hover:bg-red-200"
            : "bg-blue-100 text-blue-700 hover:bg-blue-200"
        }
        ${error ? "bg-gray-100 text-gray-500" : ""}
      `}
      aria-label={
        speaking ? `${text}の再生を停止` : `${text}をフランス語で読み上げ`
      }
    >
      <span>{speaking ? "⏹" : "🔊"}</span>
      {label && <span>{label}</span>}
      {error && <span className="text-xs text-red-500">再生エラー</span>}
    </button>
  );
}
