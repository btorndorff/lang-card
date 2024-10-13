import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Flashcard } from "@/app/constants/Flashcard";
import { API_URL } from "@/app/constants/API";

export default function useGenerateFlashcards() {
  const [nativeLanguage, setNativeLanguage] = useState("");
  const [learningLanguage, setLearningLanguage] = useState("");
  const [inputType, setInputType] = useState("text");
  const [inputText, setInputText] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);

  const handleGenerateFlashcards = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append("nativeLanguage", nativeLanguage);
    formData.append("learningLanguage", learningLanguage);

    if (inputType === "text") {
      formData.append("inputText", inputText);
    } else if (audioFile) {
      formData.append("audio_file", audioFile);
    }

    try {
      const response = await fetch(`${API_URL}/generate_flashcards`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setFlashcards(data.flashcards);
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description:
            errorData.error ||
            "Failed to generate flashcards. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
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
  };
}
