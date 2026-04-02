"use client";

import { DictionaryEntry } from "@/types/dictionary";

interface Props {
  historyIds: string[];
  favoriteIds: string[];
  reviewIds: string[];
  entries: DictionaryEntry[];
  onSelect: (entry: DictionaryEntry) => void;
  activeTab: "history" | "favorites" | "review";
  onTabChange: (tab: "history" | "favorites" | "review") => void;
}

export default function HistoryPanel({
  historyIds,
  favoriteIds,
  reviewIds,
  entries,
  onSelect,
  activeTab,
  onTabChange,
}: Props) {
  const tabs = [
    { key: "history" as const, label: "履歴", icon: "🕐", ids: historyIds },
    { key: "favorites" as const, label: "お気に入り", icon: "★", ids: favoriteIds },
    { key: "review" as const, label: "復習", icon: "📌", ids: reviewIds },
  ];

  const currentTab = tabs.find((t) => t.key === activeTab)!;
  const items = currentTab.ids
    .map((id) => entries.find((e) => e.id === id))
    .filter(Boolean) as DictionaryEntry[];

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
              activeTab === tab.key
                ? "bg-blue-50 text-blue-700 border-b-2 border-blue-500"
                : "text-gray-500 hover:bg-gray-50"
            }`}
            aria-label={`${tab.label}タブ`}
          >
            {tab.icon} {tab.label}
            {tab.ids.length > 0 && (
              <span className="ml-1 text-[10px] bg-gray-200 rounded-full px-1.5">
                {tab.ids.length}
              </span>
            )}
          </button>
        ))}
      </div>
      <div className="max-h-60 overflow-y-auto">
        {items.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">
            まだありません
          </p>
        ) : (
          <ul>
            {items.map((entry) => (
              <li key={entry.id}>
                <button
                  onClick={() => onSelect(entry)}
                  className="w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm border-b border-gray-50"
                >
                  <span className="font-medium text-gray-800" lang="fr">
                    {entry.word}
                  </span>
                  <span className="text-gray-400 text-xs truncate">
                    {entry.meaningsJa[0]}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
