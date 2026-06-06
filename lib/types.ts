export type SignEntry = {
  id: string;
  swedishWord: string;
  gloss: string;
  description: string;
  videoUrl: string;
  animationKey: string;
  transcription: string;
  lexiconUrl: string;
  imageUrl: string;
};

export type TranslationSequenceItem = {
  token: string;
  sign: SignEntry | null;
};

export type TranslationResult = {
  originalText: string;
  simplifiedSwedish: string;
  signSequence: string[];
  keywordTokens: string[];
  matchedSigns: SignEntry[];
  missingSigns: string[];
  confidenceWarnings: string[];
  sequenceItems: TranslationSequenceItem[];
};
