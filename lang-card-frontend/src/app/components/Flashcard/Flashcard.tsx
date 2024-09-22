import React from "react";
import { Flashcard as FlashcardType } from "../../constants/Flashcard";
import AudioButton from "./AudioButton";

const Flashcard = ({
  flashcard,
  isFlipped,
  setIsFlipped,
}: {
  flashcard: FlashcardType;
  isFlipped: boolean;
  setIsFlipped: (flipped: boolean) => void;
}) => {
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div
      className="flip-card w-[300px] h-[180px] md:w-[400px] md:h-[240px]"
      onClick={handleFlip}
    >
      <div className={`flip-card-inner ${isFlipped ? "flipped" : ""}`}>
        <div className="flip-card-front w-full h-full flex items-center justify-center p-4 border-4 border-secondary-red rounded-md relative">
          <div className="text-center">
            <p className="text-2xl font-bold">{flashcard.front.primary}</p>
            {flashcard.front.secondary && (
              <p className="mt-2">{flashcard.front.secondary}</p>
            )}
          </div>
          {flashcard.front.audio && (
            <div className="absolute top-2 right-2">
              <AudioButton audioData={flashcard.front.audio} />
            </div>
          )}
        </div>
        <div className="flip-card-back w-full h-full flex items-center justify-center p-4 border-4 border-secondary-red rounded-md relative">
          <div className="text-center">
            <p className="text-2xl font-bold">{flashcard.back.primary}</p>
            {flashcard.back.secondary && (
              <p className="mt-2">{flashcard.back.secondary}</p>
            )}
          </div>
          {flashcard.back.audio && (
            <div className="absolute top-2 right-2">
              <AudioButton audioData={flashcard.back.audio} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Flashcard;
