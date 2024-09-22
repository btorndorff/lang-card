import { SupportedLanguagesType } from "../constants/SUPPORTED_LANGUAGES";
import { Flashcard } from "../constants/Flashcard";
import { LanguageLevelsType } from "../constants/LANGUAGE_LEVELS";

interface GenerateFlashcardsData {
  audioFile?: File;
  nativeLanguage: string;
  learningLanguage: SupportedLanguagesType;
  flashcardFormat: Flashcard;
  languageLevel?: LanguageLevelsType;
  inputText: string;
  audioToggle: boolean;
}

interface GenerateFlashcardsResponse {
  flashcards: Flashcard[];
}

// const apiBase = "https://borff.pythonanywhere.com";
const apiBase = "http://127.0.0.1:5000";

export const generateFlashcards = async (
  data: GenerateFlashcardsData
): Promise<GenerateFlashcardsResponse> => {
  const {
    audioFile,
    nativeLanguage,
    learningLanguage,
    flashcardFormat,
    inputText,
    audioToggle,
  } = data;

  const formData = new FormData();

  if (audioFile) {
    formData.append("audio_file", audioFile);
  }

  formData.append("nativeLanguage", nativeLanguage);
  formData.append("learningLanguage", learningLanguage);
  formData.append("flashcardFormat", JSON.stringify(flashcardFormat));
  formData.append("inputText", inputText);
  formData.append("audioToggle", audioToggle.toString());

  try {
    const response = await fetch(`${apiBase}/generate_flashcards`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: GenerateFlashcardsResponse = await response.json();
    return result;
  } catch (error) {
    console.error("Error generating flashcards:", error);
    throw new Error("Failed to generate flashcards. Please try again later.");
  }
};

export const exportFlashcards = async (
  flashcards: Flashcard[]
): Promise<Blob> => {
  try {
    const activeFlashcards = flashcards.filter((fc) => fc.active);

    const response = await fetch(`${apiBase}/export_anki`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ flashcards: activeFlashcards }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.blob();
  } catch (error) {
    console.error("Error exporting flashcards:", error);
    throw new Error("Failed to export flashcards. Please try again later.");
  }
};
