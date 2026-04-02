"use client";

import { useState, useCallback } from "react";
import { DictionaryEntry } from "@/types/dictionary";
import { dictionaryData } from "@/data/dictionary";
import SearchBar from "@/components/SearchBar";
import WordDetail from "@/components/WordDetail";
import RecommendedWords from "@/components/RecommendedWords";
import HistoryPanel from "@/components/HistoryPanel";
import QuizMode from "@/components/QuizMode";
import { useFavorites } from "@/hooks/useFavorites";
import { useHistory } from "@/hooks/useHistory";
import { useReviewList } from "@/hooks/useReviewList";

export default function Home() {
  const [selectedEntry, setSelectedEntry] = useState<DictionaryEntry | null>(
    null
  );
  const [showQuiz, setShowQuiz] = useState(false);
  const [panelTab, setPanelTab] = useState<
    "history" | "favorites" | "review"
  >("history");

  const { favorites, toggle: toggleFav, isFavorite } = useFavorites();
  const { history, addToHistory } = useHistory();
  const { reviewList, toggle: toggleReview, isInReviewList } = useReviewList();

  const handleSelect = useCallback(
    (entry: DictionaryEntry) => {
      setSelectedEntry(entry);
      addToHistory(entry.id);
      setShowQuiz(false);
    },
    [addToHistory]
  );

  const handleRandomWord = useCallback(() => {
    const random =
      dictionaryData[Math.floor(Math.random() * dictionaryData.length)];
    handleSelect(random);
  }, [handleSelect]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold text-blue-700 flex items-center gap-2">
            <span className="text-2xl">📖</span>
            <span className="hidden sm:inline">フランス語学習辞書</span>
            <span className="sm:hidden">仏語辞書</span>
          </h1>
          <div className="flex gap-2">
            <button
              onClick={handleRandomWord}
              className="px-3 py-1.5 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
              aria-label="ランダムな単語を表示"
            >
              🎲 ランダム
            </button>
            <button
              onClick={() => setShowQuiz(!showQuiz)}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                showQuiz
                  ? "bg-purple-600 text-white"
                  : "bg-purple-100 text-purple-700 hover:bg-purple-200"
              }`}
              aria-label="クイズモードを切り替え"
            >
              🧠 クイズ
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Search & Navigation */}
          <div className="lg:col-span-4 space-y-4">
            <SearchBar
              entries={dictionaryData}
              onSelect={handleSelect}
              onWiktionaryResult={handleSelect}
            />

            <HistoryPanel
              historyIds={history}
              favoriteIds={favorites}
              reviewIds={reviewList}
              entries={dictionaryData}
              onSelect={handleSelect}
              activeTab={panelTab}
              onTabChange={setPanelTab}
            />
          </div>

          {/* Right Column: Detail or Welcome */}
          <div className="lg:col-span-8">
            {showQuiz ? (
              <QuizMode
                entries={dictionaryData}
                onClose={() => setShowQuiz(false)}
              />
            ) : selectedEntry ? (
              <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
                <WordDetail
                  entry={selectedEntry}
                  isFavorite={isFavorite(selectedEntry.id)}
                  isInReview={isInReviewList(selectedEntry.id)}
                  onToggleFavorite={() => toggleFav(selectedEntry.id)}
                  onToggleReview={() => toggleReview(selectedEntry.id)}
                />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
                  <p className="text-5xl mb-3">🇫🇷</p>
                  <h2 className="text-xl font-bold text-gray-700 mb-1">
                    フランス語学習辞書へようこそ
                  </h2>
                  <p className="text-gray-500 text-sm">
                    検索バーにフランス語または日本語を入力して単語を調べましょう
                  </p>
                </div>
                <RecommendedWords
                  entries={dictionaryData}
                  onSelect={handleSelect}
                />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-gray-200 bg-white py-4">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-gray-400">
          フランス語学習辞書 &mdash; 学習者のための辞書アプリ
        </div>
      </footer>
    </div>
  );
}
