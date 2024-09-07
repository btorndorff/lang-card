import { useState } from "react";
import { generateFlashcards as apiGenerateFlashcards } from "../api";
import { Flashcard } from "../constants/Flashcard";
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
      const flashcardsWithActive = response.flashcards.map(
        (flashcard: Flashcard) => ({
          ...flashcard,
          active: true,
        })
      );
      setFlashcards(flashcardsWithActive);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
      setFlashcards(null);
    } finally {
      setLoading(false);
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
