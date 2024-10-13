import { Flashcard, FlashcardFormat } from "@/app/constants/Flashcard";
import { FlashcardCard } from "./FlashcardCard";

export function FlashcardList({
  flashcards,
  toggleFlashcardActive,
  format,
}: {
  flashcards: Flashcard[];
  toggleFlashcardActive: (index: number) => void;
  format: FlashcardFormat;
}) {
  return (
    <div className="space-y-4 overflow-y-auto">
      {flashcards.map((flashcard, index) => (
        <FlashcardCard
          key={index}
          flashcard={flashcard}
          index={index}
          toggleFlashcardActive={toggleFlashcardActive}
          format={format}
        />
      ))}
    </div>
  );
}
