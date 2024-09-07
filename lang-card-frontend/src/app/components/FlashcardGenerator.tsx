import React, { useState } from "react";
import { SupportedLanguagesType } from "../constants/SUPPORTED_LANGUAGES";
import { LanguageLevelsType } from "../constants/LANGUAGE_LEVELS";
import { Flashcard, FlashcardContent } from "../constants/Flashcard";
import { useFlashcardGeneration } from "../hooks/useFlashcardGeneration";
import InputSelector from "./InputSelection/InputSelector";
import LanguageOptions from "./LanguageOptions";
import FlashcardFormat from "./FlashcardFormat";
import FlashcardList from "./Flashcard/FlashcardList";
import NavigationButtons from "./NavigationButtons";

const INITIAL_FLASHCARD_FORMAT: Flashcard = {
  front: { primary: FlashcardContent.LEARNING_LANGUAGE, secondary: null },
  back: {
    primary: FlashcardContent.NATIVE_LANGUAGE,
    secondary: FlashcardContent.EXAMPLE_SENTENCE,
  },
  active: true,
};

const FlashcardGenerator = ({ handleReset }: { handleReset: () => void }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [audioFile, setAudioFile] = useState<File | undefined>(undefined);
  const [inputText, setInputText] = useState<string>("");
  const [learningLanguage, setLearningLanguage] = useState<
    SupportedLanguagesType | undefined
  >(undefined);
  const [languageLevel, setLanguageLevel] = useState<
    LanguageLevelsType | undefined
  >(undefined);
  const [flashcardFormat, setFlashcardFormat] = useState<Flashcard>(
    INITIAL_FLASHCARD_FORMAT
  );
  const [audioToggle, setAudioToggle] = useState<boolean>(false);

  const {
    flashcards,
    loading,
    error,
    generateFlashcards,
    toggleFlashcardActive,
  } = useFlashcardGeneration();

  const handleSubmit = () => {
    if (learningLanguage) {
      generateFlashcards({
        audioFile,
        inputText,
        nativeLanguage: "en",
        learningLanguage,
        languageLevel,
        flashcardFormat,
        audioToggle,
      });
      setCurrentPage(4);
    } else {
      alert("Please select a learning language and language level");
    }
  };

  const handleNext = () => {
    if (currentPage < 3) {
      setCurrentPage((prevPage) => prevPage + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    setCurrentPage((prevPage) => Math.max(1, prevPage - 1));
  };

  const isContinueButtonDisabled = () => {
    if (currentPage === 1) return !audioFile && !inputText;
    if (currentPage === 2) return !learningLanguage;
    return false;
  };

  const renderStep = () => {
    switch (currentPage) {
      case 1:
        return (
          <InputSelector
            audioFile={audioFile}
            setAudioFile={setAudioFile}
            text={inputText}
            setText={setInputText}
          />
        );
      case 2:
        return (
          <LanguageOptions
            learningLanguage={learningLanguage}
            setLearningLanguage={setLearningLanguage}
            languageLevel={languageLevel}
            setLanguageLevel={setLanguageLevel}
          />
        );
      case 3:
        return (
          <FlashcardFormat
            nativeLanguage="en"
            learningLanguage={learningLanguage}
            setFlashcardFormat={setFlashcardFormat}
            setAudioToggle={setAudioToggle}
          />
        );
      case 4:
        return (
          <FlashcardList
            loading={loading}
            error={error}
            flashcards={flashcards}
            onToggleActive={toggleFlashcardActive}
            handleReset={handleReset}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center gap-5">
      {renderStep()}
      {currentPage < 4 && (
        <NavigationButtons
          currentPage={currentPage}
          onBack={handleBack}
          onNext={handleNext}
          isNextDisabled={isContinueButtonDisabled()}
        />
      )}
    </div>
  );
};

export default FlashcardGenerator;
