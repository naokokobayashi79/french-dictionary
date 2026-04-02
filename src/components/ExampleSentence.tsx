"use client";

import { Example } from "@/types/dictionary";
import PronunciationButton from "./PronunciationButton";

function highlightText(text: string, words: string[]): React.ReactNode[] {
  if (!words.length) return [text];

  const escaped = words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const regex = new RegExp(`(${escaped.join("|")})`, "gi");
  const parts = text.split(regex);

  return parts.map((part, i) => {
    const isHighlighted = words.some(
      (w) => w.toLowerCase() === part.toLowerCase()
    );
    return isHighlighted ? (
      <mark
        key={i}
        className="bg-yellow-200 text-yellow-900 rounded px-0.5 font-semibold"
      >
        {part}
      </mark>
    ) : (
      <span key={i}>{part}</span>
    );
  });
}

export default function ExampleSentence({ example }: { example: Example }) {
  return (
    <div className="py-2 border-b border-gray-100 last:border-b-0">
      <div className="flex items-start gap-2">
        <div className="flex-1">
          <p className="text-gray-800 font-medium" lang="fr">
            {highlightText(example.french, example.highlightWords || [])}
          </p>
          <p className="text-gray-500 text-sm mt-0.5">{example.japanese}</p>
        </div>
        <PronunciationButton text={example.french} size="sm" />
      </div>
    </div>
  );
}
