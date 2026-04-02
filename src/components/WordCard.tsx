"use client";

import { DictionaryEntry } from "@/types/dictionary";
import LevelBadge from "./LevelBadge";

interface Props {
  entry: DictionaryEntry;
  onClick: (entry: DictionaryEntry) => void;
}

const partOfSpeechShort: Record<string, string> = {
  noun: "名",
  verb: "動",
  adjective: "形",
  adverb: "副",
  preposition: "前",
  expression: "表",
  pronoun: "代",
  conjunction: "接",
  interjection: "間",
};

export default function WordCard({ entry, onClick }: Props) {
  return (
    <button
      onClick={() => onClick(entry)}
      className="w-full text-left p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all group"
      aria-label={`${entry.word}の詳細を見る`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span
              className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors"
              lang="fr"
            >
              {entry.word}
            </span>
            <span className="text-xs px-1.5 py-0.5 bg-indigo-100 text-indigo-700 rounded font-mono">
              {partOfSpeechShort[entry.partOfSpeech] || entry.partOfSpeech}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-0.5 font-mono">
            {entry.ipa}
          </p>
        </div>
        <LevelBadge level={entry.level} />
      </div>
      <p className="text-sm text-gray-600 mt-2 line-clamp-2">
        {entry.meaningsJa.join("、")}
      </p>
    </button>
  );
}
