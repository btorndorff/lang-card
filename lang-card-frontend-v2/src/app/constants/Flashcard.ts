type Flashcard = {
  term_native: string;
  term_learning_language: string;
  example_sentence_learning_language: string;
  term_audio?: string;
  sentence_audio?: string;
  active: boolean;
};

type FlashcardSide =
  | "term_native"
  | "term_learning_language"
  | "example_sentence_learning_language";

type FlashcardFormat = {
  front: FlashcardSide[];
  back: FlashcardSide[];
};

export type { Flashcard, FlashcardSide, FlashcardFormat };
