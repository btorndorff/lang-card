export const FlashcardContent = {
  NATIVE_LANGUAGE: "term_native",
  LEARNING_LANGUAGE: "term_learning_language",
  EXAMPLE_SENTENCE: "example_sentence_learning_language",
} as const;

export type FlashcardContentValue =
  (typeof FlashcardContent)[keyof typeof FlashcardContent];

export type FlashcardPrimaryValue =
  | typeof FlashcardContent.NATIVE_LANGUAGE
  | typeof FlashcardContent.LEARNING_LANGUAGE;

export type FlashcardSecondaryValue =
  | typeof FlashcardContent.EXAMPLE_SENTENCE
  | null;

export type FlashcardSide = {
  primary: string;
  secondary: string | null;
  audio?: string;
};

export type Flashcard = {
  term_native: string;
  term_learning_language: string;
  example_sentence_learning_language: string;
  front: FlashcardSide;
  back: FlashcardSide;
  active: boolean;
};
