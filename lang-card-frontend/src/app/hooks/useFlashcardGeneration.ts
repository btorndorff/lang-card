import { useState } from "react";
import { generateFlashcards as apiGenerateFlashcards } from "../api";
import {
  Flashcard,
  FlashcardSide,
  FlashcardContent,
  FlashcardPrimaryValue,
  FlashcardSecondaryValue,
} from "../constants/Flashcard";
import { SupportedLanguagesType } from "../constants/SUPPORTED_LANGUAGES";
import { LanguageLevelsType } from "../constants/LANGUAGE_LEVELS";

interface FlashcardGenerationParams {
  audioFile?: File;
  nativeLanguage: string;
  learningLanguage: SupportedLanguagesType;
  languageLevel?: LanguageLevelsType;
  flashcardFormat: Flashcard;
  inputText: string;
  context?: string;
  audioToggle: boolean;
}

export const useFlashcardGeneration = () => {
  const [flashcards, setFlashcards] = useState<Flashcard[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateFlashcards = async (params: FlashcardGenerationParams) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiGenerateFlashcards(params);
      const flashcardsWithFormat = response.flashcards.map(
        (flashcard: Omit<Flashcard, "front" | "back" | "active">) => ({
          ...flashcard,
          front: createFlashcardSide(params.flashcardFormat.front, flashcard),
          back: createFlashcardSide(params.flashcardFormat.back, flashcard),
          active: true,
        })
      );
      setFlashcards(flashcardsWithFormat);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
      setFlashcards(null);
    } finally {
      setLoading(false);
    }
  };

  const createFlashcardSide = (
    format: FlashcardSide,
    flashcard: Omit<Flashcard, "front" | "back" | "active">
  ): FlashcardSide => {
    return {
      primary: getFlashcardContent(
        format.primary as FlashcardPrimaryValue,
        flashcard
      ) as FlashcardPrimaryValue,
      secondary: format.secondary
        ? (getFlashcardContent(
            format.secondary as FlashcardSecondaryValue,
            flashcard
          ) as FlashcardSecondaryValue)
        : null,
      audio: format.audio,
    };
  };

  const getFlashcardContent = (
    contentType:
      | (typeof FlashcardContent)[keyof typeof FlashcardContent]
      | null,
    flashcard: Omit<Flashcard, "front" | "back" | "active">
  ): string | null => {
    switch (contentType) {
      case FlashcardContent.NATIVE_LANGUAGE:
        return flashcard.term_native;
      case FlashcardContent.LEARNING_LANGUAGE:
        return flashcard.term_learning_language;
      case FlashcardContent.EXAMPLE_SENTENCE:
        return flashcard.example_sentence_learning_language;
      default:
        return null;
    }
  };

  const toggleFlashcardActive = (index: number) => {
    if (flashcards) {
      const updatedFlashcards = flashcards.map((flashcard, i) =>
        i === index ? { ...flashcard, active: !flashcard.active } : flashcard
      );
      setFlashcards(updatedFlashcards);
    }
  };

  return {
    flashcards,
    loading,
    error,
    generateFlashcards,
    toggleFlashcardActive,
  };
};
