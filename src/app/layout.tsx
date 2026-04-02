import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://french-dictionary-nine.vercel.app";

export const metadata: Metadata = {
  title: "フランス語学習辞書",
  description:
    "フランス語の単語や表現を検索して、意味・文法・例文・発音まで学べる学習用辞書アプリ",
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "フランス語学習辞書 | EN FRANÇAIS?",
    description:
      "単語を検索するだけで、意味・発音・文法・例文・活用表をまとめて確認。Wiktionary連携でほぼ全単語に対応。",
    url: siteUrl,
    siteName: "フランス語学習辞書",
    images: [
      {
        url: "/ogp.png",
        width: 1200,
        height: 630,
        alt: "EN FRANÇAIS? - フランス語学習辞書",
      },
    ],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "フランス語学習辞書 | EN FRANÇAIS?",
    description:
      "単語を検索するだけで、意味・発音・文法・例文・活用表をまとめて確認。Wiktionary連携でほぼ全単語に対応。",
    images: ["/ogp.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
