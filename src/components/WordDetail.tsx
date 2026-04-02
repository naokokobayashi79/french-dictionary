"use client";

import { DictionaryEntry } from "@/types/dictionary";
import LevelBadge from "./LevelBadge";
import PronunciationButton from "./PronunciationButton";
import ExampleSentence from "./ExampleSentence";
import ConjugationTable from "./ConjugationTable";
import GrammarNotes from "./GrammarNotes";
import Accordion from "./Accordion";

interface Props {
  entry: DictionaryEntry;
  isFavorite: boolean;
  isInReview: boolean;
  onToggleFavorite: () => void;
  onToggleReview: () => void;
}

const partOfSpeechMap: Record<string, string> = {
  noun: "名詞",
  verb: "動詞",
  adjective: "形容詞",
  adverb: "副詞",
  preposition: "前置詞",
  expression: "表現",
  pronoun: "代名詞",
  conjunction: "接続詞",
  interjection: "間投詞",
};

const genderMap: Record<string, string> = {
  masculine: "男性名詞",
  feminine: "女性名詞",
  both: "男性/女性名詞",
};

export default function WordDetail({
  entry,
  isFavorite,
  isInReview,
  onToggleFavorite,
  onToggleReview,
}: Props) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-3xl font-bold text-gray-900" lang="fr">
              {entry.word}
            </h2>
            <LevelBadge level={entry.level} />
          </div>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className="text-sm px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full font-medium">
              {partOfSpeechMap[entry.partOfSpeech] || entry.partOfSpeech}
            </span>
            {entry.gender && (
              <span className="text-sm px-2 py-0.5 bg-pink-100 text-pink-700 rounded-full font-medium">
                {genderMap[entry.gender]}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-1 flex-shrink-0">
          <button
            onClick={onToggleFavorite}
            className={`p-2 rounded-lg transition-colors ${
              isFavorite
                ? "bg-yellow-100 text-yellow-600"
                : "bg-gray-100 text-gray-400 hover:bg-yellow-50"
            }`}
            aria-label={isFavorite ? "お気に入りから削除" : "お気に入りに追加"}
            title={isFavorite ? "お気に入りから削除" : "お気に入りに追加"}
          >
            {isFavorite ? "★" : "☆"}
          </button>
          <button
            onClick={onToggleReview}
            className={`p-2 rounded-lg transition-colors text-sm ${
              isInReview
                ? "bg-purple-100 text-purple-600"
                : "bg-gray-100 text-gray-400 hover:bg-purple-50"
            }`}
            aria-label={
              isInReview ? "復習リストから削除" : "復習リストに追加"
            }
            title={isInReview ? "復習リストから削除" : "復習リストに追加"}
          >
            {isInReview ? "📌" : "📎"}
          </button>
        </div>
      </div>

      {/* Pronunciation */}
      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
        <span className="text-gray-600 font-mono text-lg">{entry.ipa}</span>
        <PronunciationButton text={entry.word} label="発音を聞く" />
      </div>

      {/* Meanings */}
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
          意味
        </h3>
        <div className="space-y-1">
          <p className="text-lg text-gray-800">
            {entry.meaningsJa.join("、")}
          </p>
          {entry.meaningsEn.length > 0 && (
            <p className="text-sm text-gray-500">
              🇬🇧 {entry.meaningsEn.join(", ")}
            </p>
          )}
        </div>
      </div>

      {/* Grammar Notes */}
      {entry.grammarNotes && <GrammarNotes notes={entry.grammarNotes} />}

      {/* Conjugation */}
      {entry.conjugation && (
        <ConjugationTable conjugation={entry.conjugation} />
      )}

      {/* Examples */}
      {entry.examples.length > 0 && (
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
            例文
          </h3>
          <div className="bg-white rounded-lg border border-gray-200 p-3">
            {entry.examples.map((example, i) => (
              <ExampleSentence key={i} example={example} />
            ))}
          </div>
        </div>
      )}

      {/* Collocations */}
      {entry.collocations.length > 0 && (
        <Accordion title="よく使う組み合わせ（コロケーション）">
          <div className="flex flex-wrap gap-2">
            {entry.collocations.map((col, i) => (
              <span
                key={i}
                className="px-2 py-1 bg-orange-50 text-orange-700 border border-orange-200 rounded-lg text-sm"
                lang="fr"
              >
                {col}
              </span>
            ))}
          </div>
        </Accordion>
      )}

      {/* Synonyms & Antonyms */}
      {(entry.synonyms.length > 0 || entry.antonyms.length > 0) && (
        <Accordion title="関連語">
          <div className="space-y-2">
            {entry.synonyms.length > 0 && (
              <div>
                <span className="text-sm text-gray-500 mr-2">類義語:</span>
                <span className="text-sm font-medium" lang="fr">
                  {entry.synonyms.join(", ")}
                </span>
              </div>
            )}
            {entry.antonyms.length > 0 && (
              <div>
                <span className="text-sm text-gray-500 mr-2">反意語:</span>
                <span className="text-sm font-medium" lang="fr">
                  {entry.antonyms.join(", ")}
                </span>
              </div>
            )}
          </div>
        </Accordion>
      )}

      {/* Wiktionary source badge */}
      {entry.id.startsWith("wikt-") && (
        <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700">
          <span>📚</span>
          <span>
            このデータは Wiktionary から自動取得されました。
            ローカル辞書と比べて情報が限られる場合があります。
          </span>
        </div>
      )}

      {/* Tags */}
      {entry.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-2">
          {entry.tags.map((tag, i) => (
            <span
              key={i}
              className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
