import { DictionaryEntry, SearchResult } from "@/types/dictionary";
import { dictionaryData } from "@/data/dictionary";
import { searchDictionary } from "@/utils/search";
import { fetchFromWiktionary } from "@/utils/wiktionaryApi";

// Cache for Wiktionary results to avoid repeated API calls
const wiktionaryCache = new Map<string, DictionaryEntry | null>();

/**
 * Search local dictionary first, then optionally fetch from Wiktionary.
 * Returns { localResults, wiktionaryEntry, isLoading } pattern.
 */
export function searchLocal(query: string): SearchResult[] {
  return searchDictionary(query, dictionaryData);
}

export async function lookupWord(
  word: string
): Promise<DictionaryEntry | null> {
  // 1. Check local data first (exact match)
  const normalized = word
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

  const localMatch = dictionaryData.find((entry) => {
    const entryNorm = entry.word
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    const entryStored = entry.normalizedWord
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    return entryNorm === normalized || entryStored === normalized;
  });

  if (localMatch) return localMatch;

  // 2. Check cache
  if (wiktionaryCache.has(normalized)) {
    return wiktionaryCache.get(normalized) ?? null;
  }

  // 3. Fetch from Wiktionary
  const result = await fetchFromWiktionary(word);
  wiktionaryCache.set(normalized, result);
  return result;
}

export function getAllLocalEntries(): DictionaryEntry[] {
  return dictionaryData;
}
