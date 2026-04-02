import { DictionaryEntry, Example, PartOfSpeech, Gender, Level } from "@/types/dictionary";

// --- HTML tag stripping ---
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

// --- Part of speech mapping ---
const posMap: Record<string, PartOfSpeech> = {
  Noun: "noun",
  Verb: "verb",
  Adjective: "adjective",
  Adverb: "adverb",
  Preposition: "preposition",
  Pronoun: "pronoun",
  Conjunction: "conjunction",
  Interjection: "interjection",
  Phrase: "expression",
  Particle: "preposition",
};

const posMapJa: Record<string, string> = {
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

// --- Types for Wiktionary API responses ---
interface WiktionaryDefinition {
  definition: string;
  examples?: string[];
  parsedExamples?: { example: string; translation?: string }[];
}

interface WiktionarySection {
  partOfSpeech: string;
  language: string;
  definitions: WiktionaryDefinition[];
}

interface LookupApiResponse {
  word: string;
  ipa: string;
  sections: WiktionarySection[];
}

// --- Detect gender from definition text ---
function detectGender(sections: WiktionarySection[]): Gender {
  for (const section of sections) {
    if (section.partOfSpeech !== "Noun") continue;
    for (const def of section.definitions) {
      const text = def.definition.toLowerCase();
      if (text.includes("feminine") && text.includes("masculine")) return "both";
      if (text.includes("feminine")) return "feminine";
      if (text.includes("masculine")) return "masculine";
    }
    // Check from part of speech label patterns in HTML
    const raw = JSON.stringify(section);
    if (raw.includes('"f"') || raw.includes("feminine")) return "feminine";
    if (raw.includes('"m"') || raw.includes("masculine")) return "masculine";
  }
  return null;
}

// --- Build examples from parsed data ---
function buildExamples(sections: WiktionarySection[]): Example[] {
  const examples: Example[] = [];
  for (const section of sections) {
    for (const def of section.definitions) {
      if (def.parsedExamples) {
        for (const ex of def.parsedExamples) {
          const french = stripHtml(ex.example);
          const translation = ex.translation ? stripHtml(ex.translation) : "";
          if (french && examples.length < 5) {
            examples.push({
              french,
              japanese: translation || "(英訳なし)",
              highlightWords: [],
            });
          }
        }
      }
    }
  }
  return examples;
}

// --- Build grammar notes ---
function buildGrammarNotes(pos: PartOfSpeech): string {
  const notes: Record<string, string> = {
    noun: "Wiktionaryから取得した名詞です。冠詞（le/la/un/une）と一緒に覚えましょう。",
    verb: "Wiktionaryから取得した動詞です。活用パターンを確認して練習しましょう。",
    adjective: "Wiktionaryから取得した形容詞です。名詞の性に合わせて形が変わることがあります。",
    adverb: "Wiktionaryから取得した副詞です。動詞や形容詞を修飾します。",
    preposition: "Wiktionaryから取得した前置詞です。後に続く名詞との組み合わせで覚えましょう。",
    expression: "Wiktionaryから取得した表現です。かたまりとして覚えましょう。",
    pronoun: "Wiktionaryから取得した代名詞です。",
    conjunction: "Wiktionaryから取得した接続詞です。",
    interjection: "Wiktionaryから取得した間投詞です。",
  };
  return notes[pos] || "Wiktionaryから取得したデータです。";
}

// --- Normalize word for ID ---
function normalizeWord(word: string): string {
  return word
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-");
}

// --- Main: Fetch word via our API Route (avoids CORS) ---
export async function fetchFromWiktionary(
  word: string
): Promise<DictionaryEntry | null> {
  try {
    const res = await fetch(`/api/lookup?word=${encodeURIComponent(word)}`);

    if (!res.ok) return null;

    const data: LookupApiResponse = await res.json();
    const frSections = data.sections;

    if (!frSections || frSections.length === 0) return null;

    const ipa = data.ipa;

    // Primary section
    const primarySection = frSections[0];
    const rawPos = primarySection.partOfSpeech;
    const partOfSpeech: PartOfSpeech = posMap[rawPos] || "noun";

    // Collect all English meanings
    const meaningsEn: string[] = [];
    for (const section of frSections) {
      for (const def of section.definitions) {
        const cleaned = stripHtml(def.definition);
        if (cleaned && !cleaned.startsWith("(") && cleaned.length < 100) {
          meaningsEn.push(cleaned);
        }
      }
    }

    // Generate Japanese approximations from part of speech
    const meaningsJa = generateJapaneseMeanings(meaningsEn, partOfSpeech);

    // Examples
    const examples = buildExamples(frSections);

    // Gender
    const gender = detectGender(frSections);

    const entry: DictionaryEntry = {
      id: `wikt-${normalizeWord(word)}`,
      word,
      normalizedWord: normalizeWord(word),
      partOfSpeech,
      meaningsJa,
      meaningsEn: meaningsEn.slice(0, 5),
      gender,
      ipa: ipa || "(発音データなし)",
      grammarNotes: buildGrammarNotes(partOfSpeech),
      conjugation: null,
      examples,
      synonyms: [],
      antonyms: [],
      collocations: [],
      level: "intermediate" as Level,
      tags: ["Wiktionary", posMapJa[partOfSpeech] || ""],
    };

    return entry;
  } catch {
    return null;
  }
}

// --- Simple English-to-Japanese meaning hints ---
function generateJapaneseMeanings(
  englishMeanings: string[],
  pos: PartOfSpeech
): string[] {
  if (englishMeanings.length === 0) {
    return ["(意味は英語欄を参照)"];
  }

  // Common English-Japanese word mappings for basic coverage
  const basicMap: Record<string, string> = {
    house: "家",
    home: "家",
    book: "本",
    water: "水",
    sing: "歌う",
    eat: "食べる",
    drink: "飲む",
    sleep: "眠る",
    walk: "歩く",
    run: "走る",
    speak: "話す",
    read: "読む",
    write: "書く",
    see: "見る",
    hear: "聞く",
    come: "来る",
    go: "行く",
    love: "愛する",
    like: "好む",
    want: "欲しい",
    know: "知る",
    think: "考える",
    give: "与える",
    take: "取る",
    say: "言う",
    tell: "伝える",
    ask: "尋ねる",
    work: "働く",
    play: "遊ぶ",
    live: "生きる",
    die: "死ぬ",
    buy: "買う",
    sell: "売る",
    open: "開く",
    close: "閉じる",
    begin: "始める",
    start: "始める",
    end: "終わる",
    finish: "終える",
    learn: "学ぶ",
    teach: "教える",
    help: "助ける",
    find: "見つける",
    lose: "失う",
    win: "勝つ",
    wait: "待つ",
    send: "送る",
    receive: "受け取る",
    understand: "理解する",
    remember: "覚える",
    forget: "忘れる",
    try: "試す",
    leave: "去る",
    arrive: "着く",
    return: "戻る",
    stay: "滞在する",
    beautiful: "美しい",
    big: "大きい",
    small: "小さい",
    good: "良い",
    bad: "悪い",
    new: "新しい",
    old: "古い",
    young: "若い",
    long: "長い",
    short: "短い",
    hot: "暑い",
    cold: "寒い",
    happy: "幸せな",
    sad: "悲しい",
    fast: "速い",
    slow: "遅い",
    easy: "簡単な",
    hard: "難しい",
    difficult: "難しい",
    man: "男",
    woman: "女",
    child: "子供",
    friend: "友人",
    dog: "犬",
    cat: "猫",
    car: "車",
    city: "街",
    country: "国",
    time: "時間",
    day: "日",
    night: "夜",
    year: "年",
    month: "月",
    week: "週",
    food: "食べ物",
    money: "お金",
    name: "名前",
    place: "場所",
    world: "世界",
    life: "人生",
    head: "頭",
    hand: "手",
    eye: "目",
    heart: "心",
    door: "ドア",
    window: "窓",
    table: "テーブル",
    white: "白い",
    black: "黒い",
    red: "赤い",
    blue: "青い",
    green: "緑の",
    always: "いつも",
    never: "決して〜ない",
    often: "しばしば",
    sometimes: "時々",
    today: "今日",
    tomorrow: "明日",
    yesterday: "昨日",
    here: "ここ",
    there: "そこ",
    now: "今",
    then: "それから",
    very: "とても",
    much: "たくさん",
    many: "多くの",
    also: "〜も",
    only: "〜だけ",
    "thank you": "ありがとう",
    hello: "こんにちは",
    yes: "はい",
    no: "いいえ",
    please: "お願いします",
  };

  const results: string[] = [];

  for (const en of englishMeanings.slice(0, 3)) {
    const lower = en.toLowerCase().replace(/^to /, "");
    if (basicMap[lower]) {
      results.push(basicMap[lower]);
    }
  }

  if (results.length === 0) {
    // If no mapping found, show hint with English
    const prefix = pos === "verb" ? "〜する" : pos === "adjective" ? "〜な" : "";
    return [`${englishMeanings[0]}${prefix ? `（${prefix}）` : ""}`, "(詳しくは英語の意味を参照)"];
  }

  return [...new Set(results)];
}
