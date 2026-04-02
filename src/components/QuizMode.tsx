"use client";

import { useState, useMemo } from "react";
import { DictionaryEntry } from "@/types/dictionary";

interface Props {
  entries: DictionaryEntry[];
  onClose: () => void;
}

type QuizState = "question" | "answer";

export default function QuizMode({ entries, onClose }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [state, setState] = useState<QuizState>("question");
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const shuffled = useMemo(
    () => [...entries].sort(() => Math.random() - 0.5).slice(0, 10),
    [entries]
  );

  const current = shuffled[currentIndex];

  if (!current) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          クイズ完了！
        </h3>
        <p className="text-3xl font-bold text-blue-600 mb-4">
          {score.correct} / {score.total}
        </p>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          閉じる
        </button>
      </div>
    );
  }

  const handleAnswer = (isCorrect: boolean) => {
    setScore((prev) => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
    }));
    setState("answer");
  };

  const handleNext = () => {
    setCurrentIndex((prev) => prev + 1);
    setState("question");
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-700">
          クイズモード
        </h3>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">
            {currentIndex + 1} / {shuffled.length}
          </span>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-lg"
            aria-label="クイズを閉じる"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="text-center py-6">
        <p className="text-4xl font-bold text-gray-800 mb-2" lang="fr">
          {current.word}
        </p>
        <p className="text-sm text-gray-400 font-mono">{current.ipa}</p>
      </div>

      {state === "question" ? (
        <div className="space-y-3">
          <p className="text-center text-gray-600 mb-4">
            この単語の意味がわかりますか？
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => handleAnswer(true)}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              わかる ⭕
            </button>
            <button
              onClick={() => handleAnswer(false)}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              わからない ❌
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <p className="text-lg font-medium text-gray-800">
              {current.meaningsJa.join("、")}
            </p>
            {current.meaningsEn.length > 0 && (
              <p className="text-sm text-gray-500 mt-1">
                {current.meaningsEn.join(", ")}
              </p>
            )}
          </div>
          {current.examples[0] && (
            <div className="bg-gray-50 rounded-lg p-3 text-sm">
              <p className="text-gray-700" lang="fr">
                {current.examples[0].french}
              </p>
              <p className="text-gray-500">{current.examples[0].japanese}</p>
            </div>
          )}
          <div className="text-center">
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              次の問題 →
            </button>
          </div>
        </div>
      )}

      <div className="mt-4 text-center text-sm text-gray-400">
        スコア: {score.correct} / {score.total}
      </div>
    </div>
  );
}
