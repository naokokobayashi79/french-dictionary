"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { DictionaryEntry, SearchResult } from "@/types/dictionary";
import { searchDictionary } from "@/utils/search";
import { lookupWord } from "@/utils/dictionaryService";

interface Props {
  entries: DictionaryEntry[];
  onSelect: (entry: DictionaryEntry) => void;
  onWiktionaryResult?: (entry: DictionaryEntry) => void;
}

export default function SearchBar({
  entries,
  onSelect,
  onWiktionaryResult,
}: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isSearchingWiki, setIsSearchingWiki] = useState(false);
  const [wikiError, setWikiError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSearch = useCallback(
    (value: string) => {
      setQuery(value);
      setWikiError(false);
      if (value.trim()) {
        const found = searchDictionary(value, entries);
        setResults(found);
        setShowSuggestions(true);
        setSelectedIndex(-1);
      } else {
        setResults([]);
        setShowSuggestions(false);
      }
    },
    [entries]
  );

  const handleSelect = useCallback(
    (entry: DictionaryEntry) => {
      setQuery(entry.word);
      setShowSuggestions(false);
      onSelect(entry);
    },
    [onSelect]
  );

  const handleWiktionarySearch = useCallback(async () => {
    if (!query.trim()) return;
    setIsSearchingWiki(true);
    setWikiError(false);
    try {
      const entry = await lookupWord(query.trim());
      if (entry) {
        setShowSuggestions(false);
        onWiktionaryResult?.(entry);
      } else {
        setWikiError(true);
      }
    } catch {
      setWikiError(true);
    } finally {
      setIsSearchingWiki(false);
    }
  }, [query, onWiktionaryResult]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !showSuggestions && query.trim()) {
      // No local suggestions visible — trigger Wiktionary search
      e.preventDefault();
      handleWiktionarySearch();
      return;
    }

    if (!showSuggestions || results.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < results.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : results.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleSelect(results[selectedIndex].entry);
        } else if (results.length > 0) {
          handleSelect(results[0].entry);
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        break;
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const matchTypeBadge = (type: SearchResult["matchType"]) => {
    const styles = {
      exact: "bg-green-100 text-green-700",
      prefix: "bg-blue-100 text-blue-700",
      partial: "bg-gray-100 text-gray-600",
    };
    const labels = {
      exact: "完全一致",
      prefix: "前方一致",
      partial: "部分一致",
    };
    return (
      <span className={`text-[10px] px-1.5 py-0.5 rounded ${styles[type]}`}>
        {labels[type]}
      </span>
    );
  };

  const partOfSpeechJa: Record<string, string> = {
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

  const noLocalResults = showSuggestions && query.trim() && results.length === 0;

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => query.trim() && setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          placeholder="フランス語・日本語で検索..."
          className="w-full px-4 py-3 pl-10 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors bg-white"
          aria-label="辞書検索"
          aria-autocomplete="list"
          aria-expanded={showSuggestions}
          role="combobox"
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          🔍
        </span>
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setResults([]);
              setShowSuggestions(false);
              setWikiError(false);
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label="検索をクリア"
          >
            ✕
          </button>
        )}
      </div>

      {/* Wiktionary search button — always visible when there's a query */}
      {query.trim() && (
        <button
          onClick={handleWiktionarySearch}
          disabled={isSearchingWiki}
          className="w-full mt-1.5 px-3 py-2 text-sm bg-amber-50 text-amber-700 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          aria-label="Wiktionaryで検索"
        >
          {isSearchingWiki ? (
            <>
              <span className="animate-spin">⏳</span>
              Wiktionary を検索中...
            </>
          ) : (
            <>
              📚 Wiktionary でも検索する
            </>
          )}
        </button>
      )}

      {wikiError && (
        <p className="mt-1 text-xs text-red-500 text-center">
          Wiktionary に「{query}」のフランス語データが見つかりませんでした
        </p>
      )}

      {showSuggestions && results.length > 0 && (
        <ul
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-80 overflow-y-auto"
          style={{ top: query.trim() ? "5.5rem" : "3.25rem" }}
          role="listbox"
        >
          {results.map((result, index) => (
            <li
              key={result.entry.id}
              onClick={() => handleSelect(result.entry)}
              onMouseEnter={() => setSelectedIndex(index)}
              className={`px-4 py-2.5 cursor-pointer flex items-center gap-2 transition-colors ${
                index === selectedIndex ? "bg-blue-50" : "hover:bg-gray-50"
              }`}
              role="option"
              aria-selected={index === selectedIndex}
            >
              <span className="text-xs px-1.5 py-0.5 bg-indigo-100 text-indigo-700 rounded font-mono">
                {partOfSpeechJa[result.entry.partOfSpeech] ||
                  result.entry.partOfSpeech}
              </span>
              <span className="font-medium text-gray-800" lang="fr">
                {result.entry.word}
              </span>
              <span className="text-sm text-gray-500 truncate flex-1">
                {result.entry.meaningsJa.join(", ")}
              </span>
              {matchTypeBadge(result.matchType)}
            </li>
          ))}
        </ul>
      )}

      {noLocalResults && !isSearchingWiki && (
        <div
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg px-4 py-4 text-center text-gray-500 text-sm"
          style={{ top: query.trim() ? "5.5rem" : "3.25rem" }}
        >
          ローカルに「{query}」が見つかりません。
          <br />
          上の「Wiktionary でも検索する」ボタンを押してみてください。
        </div>
      )}
    </div>
  );
}
