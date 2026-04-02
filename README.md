# フランス語学習辞書

フランス語の単語や表現を検索して、意味・文法・例文・発音まで学べる学習用辞書アプリです。

## 起動方法

```bash
# 依存パッケージのインストール
npm install

# 開発サーバーの起動
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

## テストの実行

```bash
npx jest
```

## 主な機能

### 検索
- フランス語・日本語・英語で検索可能
- 前方一致・部分一致に対応
- アクセント記号なしでも検索可能（例: `etre` → `être`）
- 検索候補をリアルタイム表示、キーボード操作対応

### 単語詳細
- 見出し語、品詞、日本語/英語の意味
- 名詞の性（男性/女性）表示
- IPA 発音記号 + TTS 音声再生（Web Speech API）
- 学習者向け文法ポイント
- 動詞の活用表（現在形・複合過去・半過去・単純未来・命令形）
- 例文（日本語訳付き、重要語ハイライト、音声再生可能）
- コロケーション、類義語、反意語
- レベル表示（初級・中級・上級）

### 学習補助
- お気に入り登録（LocalStorage 保存）
- 閲覧履歴（最大50件、LocalStorage 保存）
- 復習リスト（LocalStorage 保存）
- ランダム単語表示
- クイズモード

### UI/UX
- デスクトップ: 左に検索、右に詳細の2カラム
- モバイル: 縦並びのレスポンシブ対応
- アコーディオンで長い解説を折りたたみ
- アクセシビリティ対応（aria-label、キーボードナビゲーション）

## プロジェクト構成

```
src/
├── app/               # Next.js App Router
│   ├── layout.tsx     # ルートレイアウト
│   ├── page.tsx       # メインページ
│   └── globals.css    # グローバルスタイル
├── components/        # UIコンポーネント
│   ├── Accordion.tsx          # 折りたたみUI
│   ├── ConjugationTable.tsx   # 動詞活用表
│   ├── ExampleSentence.tsx    # 例文表示
│   ├── GrammarNotes.tsx       # 文法ポイント
│   ├── HistoryPanel.tsx       # 履歴/お気に入り/復習パネル
│   ├── LevelBadge.tsx         # レベルバッジ
│   ├── PronunciationButton.tsx # 発音ボタン
│   ├── QuizMode.tsx           # クイズモード
│   ├── RecommendedWords.tsx   # おすすめ単語
│   ├── SearchBar.tsx          # 検索バー
│   ├── WordCard.tsx           # 単語カード
│   └── WordDetail.tsx         # 単語詳細表示
├── data/
│   └── dictionary.ts  # 辞書データ（ローカルJSON）
├── hooks/             # カスタムフック
│   ├── useFavorites.ts
│   ├── useHistory.ts
│   ├── useReviewList.ts
│   └── useSpeech.ts
├── types/
│   └── dictionary.ts  # 型定義
└── utils/             # ユーティリティ
    ├── search.ts      # 検索ロジック
    ├── speech.ts      # 音声再生
    └── storage.ts     # LocalStorage管理
```

## 技術スタック

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- Web Speech API (TTS)
- Jest（テスト）

## 収録語彙

bonjour, merci, être, avoir, aller, faire, prendre, maison, livre, beau, petit, à, de, pour, il y a

## 今後の改善案

- **辞書データの拡充**: 語彙数を増やす、外部辞書APIとの連携
- **検索の強化**: ファジー検索、活用形からの逆引き
- **クイズの充実**: 選択式クイズ、スペルテスト、聞き取りクイズ
- **学習管理**: 学習進捗の可視化、間隔反復法（SRS）
- **音声入力**: 発音練習機能
- **ダークモード対応**
- **PWA化**: オフライン対応
- **ユーザー認証**: クラウド同期
