"use client";

import { useState, useEffect } from "react";
import { DictionaryEntry } from "@/types/dictionary";
import { getRandomEntries } from "@/utils/search";
import WordCard from "./WordCard";

interface Props {
  entries: DictionaryEntry[];
  onSelect: (entry: DictionaryEntry) => void;
}

export default function RecommendedWords({ entries, onSelect }: Props) {
  const [recommended, setRecommended] = useState<DictionaryEntry[]>([]);

  useEffect(() => {
    setRecommended(getRandomEntries(entries, 6));
  }, [entries]);

  const refresh = () => {
    setRecommended(getRandomEntries(entries, 6));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-gray-700">
          おすすめ単語
        </h2>
        <button
          onClick={refresh}
          className="text-sm text-blue-600 hover:text-blue-800 transition-colors px-2 py-1 rounded hover:bg-blue-50"
          aria-label="おすすめ単語を更新"
        >
          🔄 別の単語を見る
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {recommended.map((entry) => (
          <WordCard key={entry.id} entry={entry} onClick={onSelect} />
        ))}
      </div>
    </div>
  );
}
