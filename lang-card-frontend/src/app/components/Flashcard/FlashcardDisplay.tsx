import React, { useState } from "react";
import { Flashcard as FlashcardType } from "../../constants/Flashcard";
import Flashcard from "./Flashcard";

const FlashcardDisplay = ({
  flashcards,
}: {
  flashcards: FlashcardType[];
}): React.ReactElement | null => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prevIndex) =>
      prevIndex < flashcards.length - 1 ? prevIndex + 1 : 0
    );
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : flashcards.length - 1
    );
  };

  if (!flashcards || flashcards.length === 0) {
    return <p>No flashcards available</p>;
  }

  return (
    <div className="flex flex-col items-center py-5 w-full">
      <div className="flex items-center justify-center w-full">
        <Flashcard
          key={currentIndex}
          flashcard={flashcards[currentIndex]}
          isFlipped={isFlipped}
          setIsFlipped={setIsFlipped}
        />
      </div>
      <div className="flex items-center justify-center w-full mt-3">
        <button
          onClick={handlePrev}
          className="px-4 py-2 font-semibold bg-secondary-red rounded-[25px] text-white mx-3"
        >
          Prev
        </button>
        <p className="mx-3">
          {currentIndex + 1} / {flashcards.length}
        </p>
        <button
          onClick={handleNext}
          className="px-4 py-2 font-semibold bg-secondary-red rounded-[25px] text-white mx-3"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default FlashcardDisplay;
