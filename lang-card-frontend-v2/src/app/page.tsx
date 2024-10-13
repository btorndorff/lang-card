"use client";

import { useState } from "react";
import { FlashcardForm } from "@/components/home/FlashcardForm/FlashcardForm";
import { FlashcardsView } from "@/components/home/FlashcardView/FlashcardView";
import { toast } from "@/hooks/use-toast";
import { Flashcard } from "@/app/constants/Flashcard";
import { API_URL } from "@/app/constants/API";
import { languages } from "@/app/constants/Languages";
import useGenerateFlashcards from "@/hooks/useGenerateFlashcards";

export default function Home() {
  const {
    nativeLanguage,
    setNativeLanguage,
    learningLanguage,
    setLearningLanguage,
    inputType,
    setInputType,
    inputText,
    setInputText,
    audioFile,
    setAudioFile,
    isLoading,
    flashcards,
    setFlashcards,
    handleGenerateFlashcards,
  } = useGenerateFlashcards();

  return (
    <div className="flex flex-col items-center justify-center p-4 h-screen">
      {flashcards.length > 0 ? (
        <FlashcardsView
          flashcards={flashcards}
          setFlashcards={setFlashcards}
          learningLanguage={learningLanguage}
        />
      ) : (
        <FlashcardForm
          nativeLanguage={nativeLanguage}
          setNativeLanguage={setNativeLanguage}
          learningLanguage={learningLanguage}
          setLearningLanguage={setLearningLanguage}
          inputType={inputType}
          setInputType={setInputType}
          inputText={inputText}
          setInputText={setInputText}
          audioFile={audioFile}
          setAudioFile={setAudioFile}
          isLoading={isLoading}
          handleGenerateFlashcards={handleGenerateFlashcards}
        />
      )}
    </div>
  );
}
