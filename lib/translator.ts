import { findSignBySwedishWord } from "@/lib/signs";
import type { SignEntry, TranslationResult } from "@/lib/types";

const dictionary: Record<string, string> = {
  i: "jag",
  me: "jag",
  my: "jag",
  you: "du",
  want: "vilja",
  wants: "vilja",
  would: "vilja",
  like: "vilja",
  eat: "äta",
  eating: "äta",
  food: "äta",
  school: "skola",
  tomorrow: "imorgon",
  thanks: "tack",
  thank: "tack",
  help: "hjälp",
  how: "hur",
  feel: "må",
  feeling: "må",
  water: "vatten",
  work: "arbete",
  job: "arbete",
  jag: "jag",
  mig: "jag",
  du: "du",
  dig: "du",
  vill: "vilja",
  vilja: "vilja",
  äta: "äta",
  ater: "äta",
  äter: "äta",
  mat: "äta",
  skola: "skola",
  skolan: "skola",
  imorgon: "imorgon",
  tack: "tack",
  hjälpa: "hjälp",
  hjälp: "hjälp",
  vatten: "vatten",
  arbete: "arbete",
  jobba: "arbete",
  jobb: "arbete",
  hur: "hur",
  må: "må",
  mår: "må"
};

const fillerWords = new Set([
  "a",
  "an",
  "and",
  "are",
  "at",
  "can",
  "do",
  "for",
  "in",
  "is",
  "please",
  "the",
  "to",
  "with",
  "att",
  "det",
  "en",
  "ett",
  "i",
  "kan",
  "och",
  "pa",
  "på",
  "som",
  "till",
  "vill"
]);

const timeWords = new Set(["imorgon"]);
const pronouns = new Set(["jag", "du"]);
const verbs = new Set(["vilja", "äta", "hjälp", "arbete", "må"]);

function normalizeToken(token: string) {
  return token
    .toLowerCase()
    .normalize("NFC")
    .replace(/[.,!?;:()"']/g, "")
    .trim();
}

function uniqueWords(words: string[]) {
  return Array.from(new Set(words));
}

function orderForGloss(words: string[]) {
  const unique = uniqueWords(words);

  if (unique.includes("hur") && unique.includes("må") && unique.includes("du")) {
    return ["hur", "må", "du", ...unique.filter((word) => !["hur", "må", "du"].includes(word))];
  }

  return [
    ...unique.filter((word) => timeWords.has(word)),
    ...unique.filter((word) => pronouns.has(word)),
    ...unique.filter((word) => !timeWords.has(word) && !pronouns.has(word) && !verbs.has(word)),
    ...unique.filter((word) => verbs.has(word))
  ];
}

export function translateToSignLearningOutput(text: string): TranslationResult {
  const sourceTokens = text.split(/\s+/).map(normalizeToken).filter(Boolean);
  const translatedTokens = sourceTokens
    .map((token) => dictionary[token] ?? token)
    .filter((token) => !fillerWords.has(token));

  const keywordTokens = uniqueWords(translatedTokens);
  const signWords = orderForGloss(keywordTokens);
  const matchedSigns = signWords
    .map(findSignBySwedishWord)
    .filter((sign): sign is SignEntry => Boolean(sign));
  const missingSigns = signWords.filter((word) => !findSignBySwedishWord(word));
  const signSequence = matchedSigns.map((sign) => sign.gloss);

  const confidenceWarnings = [
    "This is a learning aid, not a certified interpreter.",
    "Swedish Sign Language has its own grammar and culture. This mock translator only creates a beginner-friendly study sequence."
  ];

  if (missingSigns.length > 0) {
    confidenceWarnings.push("Some words are missing from the local sign database and need human review.");
  }

  if (text.trim().length === 0) {
    confidenceWarnings.push("No input text was provided.");
  }

  return {
    originalText: text,
    simplifiedSwedish: keywordTokens.join(" "),
    signSequence,
    keywordTokens,
    matchedSigns,
    missingSigns,
    confidenceWarnings
  };
}
