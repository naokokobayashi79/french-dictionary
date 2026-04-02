export type PartOfSpeech =
  | "noun"
  | "verb"
  | "adjective"
  | "adverb"
  | "preposition"
  | "expression"
  | "pronoun"
  | "conjunction"
  | "interjection";

export type Gender = "masculine" | "feminine" | "both" | null;

export type Level = "beginner" | "intermediate" | "advanced";

export interface Example {
  french: string;
  japanese: string;
  highlightWords?: string[];
}

export interface Conjugation {
  group?: string;
  present?: Record<string, string>;
  passCompose?: Record<string, string>;
  imparfait?: Record<string, string>;
  futurSimple?: Record<string, string>;
  imperatif?: string[];
  participePresent?: string;
  participePasse?: string;
}

export interface DictionaryEntry {
  id: string;
  word: string;
  normalizedWord: string;
  partOfSpeech: PartOfSpeech;
  meaningsJa: string[];
  meaningsEn: string[];
  gender: Gender;
  ipa: string;
  grammarNotes: string;
  conjugation: Conjugation | null;
  examples: Example[];
  synonyms: string[];
  antonyms: string[];
  collocations: string[];
  level: Level;
  tags: string[];
}

export interface SearchResult {
  entry: DictionaryEntry;
  matchType: "exact" | "prefix" | "partial";
}

export interface StorageData {
  favorites: string[];
  history: string[];
  reviewList: string[];
}
