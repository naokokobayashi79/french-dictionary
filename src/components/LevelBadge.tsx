"use client";

import { Level } from "@/types/dictionary";

const levelConfig: Record<Level, { label: string; className: string }> = {
  beginner: {
    label: "初級",
    className: "bg-green-100 text-green-800 border-green-300",
  },
  intermediate: {
    label: "中級",
    className: "bg-yellow-100 text-yellow-800 border-yellow-300",
  },
  advanced: {
    label: "上級",
    className: "bg-red-100 text-red-800 border-red-300",
  },
};

export default function LevelBadge({ level }: { level: Level }) {
  const config = levelConfig[level];
  return (
    <span
      className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full border ${config.className}`}
    >
      {config.label}
    </span>
  );
}
