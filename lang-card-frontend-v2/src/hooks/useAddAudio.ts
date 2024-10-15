import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Flashcard } from "@/app/constants/Flashcard";
import { API_URL } from "@/app/constants/API";

export function useAddAudio() {
  const [isAddingAudio, setIsAddingAudio] = useState(false);

  const handleAddAudio = async (
    activeFlashcards: Flashcard[],
    learningLanguage: string,
    setFlashcards: React.Dispatch<React.SetStateAction<Flashcard[]>>
  ) => {
    setIsAddingAudio(true);
    try {
      if (activeFlashcards.length === 0) {
        toast({
          title: "No active flashcards",
          description: "Please select at least one flashcard to add audio.",
          variant: "destructive",
        });
        return;
      }
      const response = await fetch(`${API_URL}/add_audio_to_flashcards`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          flashcards: activeFlashcards,
          learningLanguage: learningLanguage,
        }),
      });

      if (response.ok) {
        const updatedFlashcards = await response.json();
        setFlashcards(updatedFlashcards.flashcards);
        toast({
          title: "Success",
          description: "Audio added to flashcards successfully.",
          variant: "default",
        });
      } else {
        console.error("Failed to add audio to flashcards");
        toast({
          title: "Error",
          description: "Failed to add audio to flashcards. Please try again.",
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
      setIsAddingAudio(false);
    }
  };

  return {
    isAddingAudio,
    handleAddAudio,
  };
}
