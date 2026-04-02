"use client";

import Accordion from "./Accordion";

export default function GrammarNotes({ notes }: { notes: string }) {
  return (
    <Accordion title="文法ポイント" defaultOpen={true}>
      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
        {notes}
      </p>
    </Accordion>
  );
}
