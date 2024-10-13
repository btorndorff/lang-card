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

  const renderSide = (side: FlashcardType["front"] | FlashcardType["back"]) => (
    <>
      <div className="text-center">
        <p className="text-2xl font-bold">{side.primary}</p>
        {side.secondary && <p className="mt-2">{side.secondary}</p>}
      </div>
      {side.audio && (
        <div className="absolute top-2 right-2">
          <AudioButton audioData={side.audio} />
        </div>
      )}
    </>
  );

  return (
    <div
      className="flip-card w-[300px] h-[180px] md:w-[400px] md:h-[240px]"
      onClick={handleFlip}
    >
      <div className={`flip-card-inner ${isFlipped ? "flipped" : ""}`}>
        <div className="flip-card-front w-full h-full flex items-center justify-center p-4 border-4 border-secondary-red rounded-md relative">
          {renderSide(flashcard.front)}
        </div>
        <div className="flip-card-back w-full h-full flex items-center justify-center p-4 border-4 border-secondary-red rounded-md relative">
          {renderSide(flashcard.back)}
        </div>
      </div>
    </div>
  );
};

export default Flashcard;
