import type { NextRequest } from "next/server";

const USER_AGENT = "FrenchDictionaryApp/1.0 (learning-app)";

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

interface WiktionaryResponse {
  fr?: WiktionarySection[];
  [key: string]: WiktionarySection[] | undefined;
}

async function fetchDefinitions(
  word: string
): Promise<WiktionarySection[] | null> {
  const url = `https://en.wiktionary.org/api/rest_v1/page/definition/${encodeURIComponent(word)}`;
  const res = await fetch(url, {
    headers: { "User-Agent": USER_AGENT },
    next: { revalidate: 86400 }, // Cache for 24 hours
  });
  if (!res.ok) return null;
  const data: WiktionaryResponse = await res.json();
  return data.fr ?? null;
}

async function fetchIpa(word: string): Promise<string> {
  try {
    const url = `https://fr.wiktionary.org/w/api.php?action=parse&page=${encodeURIComponent(word)}&prop=wikitext&format=json&origin=*`;
    const res = await fetch(url, {
      headers: { "User-Agent": USER_AGENT },
      next: { revalidate: 86400 },
    });
    if (!res.ok) return "";
    const data = await res.json();
    const wikitext: string = data?.parse?.wikitext?.["*"] || "";
    const match = wikitext.match(/\{\{pron\|([^|}]+)\|/);
    return match ? `/${match[1]}/` : "";
  } catch {
    return "";
  }
}

export async function GET(request: NextRequest) {
  const word = request.nextUrl.searchParams.get("word");

  if (!word || !word.trim()) {
    return Response.json({ error: "word parameter is required" }, { status: 400 });
  }

  try {
    // Fetch definitions and IPA in parallel
    const [frSections, ipa] = await Promise.all([
      fetchDefinitions(word.trim()),
      fetchIpa(word.trim()),
    ]);

    if (!frSections || frSections.length === 0) {
      return Response.json({ error: "not_found" }, { status: 404 });
    }

    return Response.json({
      word: word.trim(),
      ipa,
      sections: frSections,
    });
  } catch {
    return Response.json({ error: "upstream_error" }, { status: 502 });
  }
}
