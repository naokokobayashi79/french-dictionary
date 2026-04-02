"use client";

import { Conjugation } from "@/types/dictionary";
import Accordion from "./Accordion";

const tenseLabels: Record<string, string> = {
  present: "現在形 (Présent)",
  passCompose: "複合過去 (Passé composé)",
  imparfait: "半過去 (Imparfait)",
  futurSimple: "単純未来 (Futur simple)",
};

const pronounOrder = [
  "je",
  "tu",
  "il/elle",
  "nous",
  "vous",
  "ils/elles",
];

function TenseTable({
  tense,
  data,
}: {
  tense: string;
  data: Record<string, string>;
}) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-gray-600 mb-1">
        {tenseLabels[tense] || tense}
      </h4>
      <table className="w-full text-sm mb-3">
        <tbody>
          {pronounOrder.map((pronoun) =>
            data[pronoun] ? (
              <tr key={pronoun} className="border-b border-gray-50">
                <td className="py-1 pr-3 text-gray-500 w-24 font-mono">
                  {pronoun}
                </td>
                <td className="py-1 text-gray-800 font-medium">{data[pronoun]}</td>
              </tr>
            ) : null
          )}
        </tbody>
      </table>
    </div>
  );
}

export default function ConjugationTable({
  conjugation,
}: {
  conjugation: Conjugation;
}) {
  return (
    <Accordion title="活用を見る">
      <div className="space-y-3">
        {conjugation.group && (
          <p className="text-sm text-indigo-600 font-medium">
            {conjugation.group}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {conjugation.present && (
            <TenseTable tense="present" data={conjugation.present} />
          )}
          {conjugation.passCompose && (
            <TenseTable tense="passCompose" data={conjugation.passCompose} />
          )}
          {conjugation.imparfait && (
            <TenseTable tense="imparfait" data={conjugation.imparfait} />
          )}
          {conjugation.futurSimple && (
            <TenseTable tense="futurSimple" data={conjugation.futurSimple} />
          )}
        </div>

        <div className="flex flex-wrap gap-4 text-sm">
          {conjugation.imperatif && (
            <div>
              <span className="text-gray-500">命令形: </span>
              <span className="font-medium">
                {conjugation.imperatif.join(", ")}
              </span>
            </div>
          )}
          {conjugation.participePresent && (
            <div>
              <span className="text-gray-500">現在分詞: </span>
              <span className="font-medium">
                {conjugation.participePresent}
              </span>
            </div>
          )}
          {conjugation.participePasse && (
            <div>
              <span className="text-gray-500">過去分詞: </span>
              <span className="font-medium">{conjugation.participePasse}</span>
            </div>
          )}
        </div>
      </div>
    </Accordion>
  );
}
