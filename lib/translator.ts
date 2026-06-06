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

function normalizeToken(token: string) {
  return token
    .toLowerCase()
    .normalize("NFC")
    .replace(/[.,!?;:()"']/g, "")
    .trim();
}

function translateTokens(sourceTokens: string[]) {
  const phrase = sourceTokens.join(" ");

  if (phrase === "how are you" || phrase === "how do you feel") {
    return ["hur", "må", "du"];
  }

  return sourceTokens.map((token) => dictionary[token] ?? token);
}

export function translateToSignLearningOutput(text: string): TranslationResult {
  const sourceTokens = text.split(/\s+/).map(normalizeToken).filter(Boolean);
  const keywordTokens = translateTokens(sourceTokens);
  const sequenceItems = keywordTokens.map((token) => ({
    token,
    sign: findSignBySwedishWord(token) ?? null
  }));
  const matchedSigns = sequenceItems
    .map((item) => item.sign)
    .filter((sign): sign is SignEntry => Boolean(sign));
  const missingSigns = sequenceItems.filter((item) => !item.sign).map((item) => item.token);
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
    confidenceWarnings,
    sequenceItems
  };
}
