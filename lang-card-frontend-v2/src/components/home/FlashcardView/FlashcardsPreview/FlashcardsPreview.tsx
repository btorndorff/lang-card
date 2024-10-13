import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Flashcard as FlashcardType,
  FlashcardFormat,
} from "@/app/constants/Flashcard";
import { Flashcard } from "./Flashcard";

export function FlashcardsPreview({
  flashcards,
  format,
}: {
  flashcards: FlashcardType[];
  format: FlashcardFormat;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : flashcards.length - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex < flashcards.length - 1 ? prevIndex + 1 : 0
    );
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-[400px] aspect-[5/3] mb-4">
        {flashcards.length > 0 && (
          <Flashcard
            key={currentIndex}
            flashcard={flashcards[currentIndex]}
            format={format}
          />
        )}
      </div>
      <div className="flex items-center justify-center space-x-4">
        <Button onClick={handlePrevious} variant="outline" size="icon">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium">
          {currentIndex + 1}/{flashcards.length}
        </span>
        <Button onClick={handleNext} variant="outline" size="icon">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
