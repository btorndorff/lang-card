export const FlashcardContent = {
  NATIVE_LANGUAGE: "native_language",
  LEARNING_LANGUAGE: "learning_language",
  EXAMPLE_SENTENCE: "example_sentence",
  HIRIGANA: "hirigana",
} as const;

export type FlashcardContentValue =
  (typeof FlashcardContent)[keyof typeof FlashcardContent];

export type FlashcardPrimaryValue =
  | typeof FlashcardContent.NATIVE_LANGUAGE
  | typeof FlashcardContent.LEARNING_LANGUAGE;

export type FlashcardSecondaryValue =
  | typeof FlashcardContent.EXAMPLE_SENTENCE
  | typeof FlashcardContent.HIRIGANA
  | null;

export type FlashcardSide = {
  primary: Exclude<
    FlashcardContentValue,
    typeof FlashcardContent.EXAMPLE_SENTENCE
  >;
  secondary: typeof FlashcardContent.EXAMPLE_SENTENCE | null;
  audio?: string;
};

export type Flashcard = {
  front: FlashcardSide;
  back: FlashcardSide;
  active: boolean;
};
