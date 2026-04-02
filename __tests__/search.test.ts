import { searchDictionary, getRandomEntries } from "@/utils/search";
import { dictionaryData } from "@/data/dictionary";

describe("searchDictionary", () => {
  it("finds exact match", () => {
    const results = searchDictionary("bonjour", dictionaryData);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].matchType).toBe("exact");
    expect(results[0].entry.word).toBe("bonjour");
  });

  it("finds exact match ignoring accents", () => {
    const results = searchDictionary("etre", dictionaryData);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].entry.word).toBe("être");
  });

  it("finds prefix match", () => {
    const results = searchDictionary("bon", dictionaryData);
    expect(results.some((r) => r.matchType === "prefix")).toBe(true);
  });

  it("finds partial match by Japanese meaning", () => {
    const results = searchDictionary("ありがとう", dictionaryData);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].entry.word).toBe("merci");
  });

  it("finds partial match in English meaning", () => {
    const results = searchDictionary("hello", dictionaryData);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].entry.word).toBe("bonjour");
  });

  it("returns empty for empty query", () => {
    const results = searchDictionary("", dictionaryData);
    expect(results).toHaveLength(0);
  });

  it("returns empty for no match", () => {
    const results = searchDictionary("zzzzz", dictionaryData);
    expect(results).toHaveLength(0);
  });

  it("results are sorted: exact > prefix > partial", () => {
    const results = searchDictionary("a", dictionaryData);
    const types = results.map((r) => r.matchType);
    const order = { exact: 0, prefix: 1, partial: 2 };
    for (let i = 1; i < types.length; i++) {
      expect(order[types[i]]).toBeGreaterThanOrEqual(order[types[i - 1]]);
    }
  });
});

describe("getRandomEntries", () => {
  it("returns the requested number of entries", () => {
    const results = getRandomEntries(dictionaryData, 3);
    expect(results).toHaveLength(3);
  });

  it("returns all entries if count exceeds data length", () => {
    const results = getRandomEntries(dictionaryData, 100);
    expect(results.length).toBeLessThanOrEqual(dictionaryData.length);
  });

  it("does not mutate original array", () => {
    const original = [...dictionaryData];
    getRandomEntries(dictionaryData, 5);
    expect(dictionaryData).toEqual(original);
  });
});
