import { DictionaryEntry, SearchResult } from "@/types/dictionary";

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

export function searchDictionary(
  query: string,
  entries: DictionaryEntry[]
): SearchResult[] {
  if (!query.trim()) return [];

  const normalizedQuery = normalize(query);
  const results: SearchResult[] = [];

  for (const entry of entries) {
    const normalizedWord = normalize(entry.word);
    const normalizedStored = normalize(entry.normalizedWord);

    if (normalizedWord === normalizedQuery || normalizedStored === normalizedQuery) {
      results.push({ entry, matchType: "exact" });
    } else if (
      normalizedWord.startsWith(normalizedQuery) ||
      normalizedStored.startsWith(normalizedQuery)
    ) {
      results.push({ entry, matchType: "prefix" });
    } else if (
      normalizedWord.includes(normalizedQuery) ||
      normalizedStored.includes(normalizedQuery) ||
      entry.meaningsJa.some((m) => m.includes(query)) ||
      entry.meaningsEn.some((m) =>
        normalize(m).includes(normalizedQuery)
      ) ||
      entry.tags.some((t) => t.includes(query))
    ) {
      results.push({ entry, matchType: "partial" });
    }
  }

  const order = { exact: 0, prefix: 1, partial: 2 };
  return results.sort((a, b) => order[a.matchType] - order[b.matchType]);
}

export function getRandomEntries(
  entries: DictionaryEntry[],
  count: number
): DictionaryEntry[] {
  const shuffled = [...entries].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
