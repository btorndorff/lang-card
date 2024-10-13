import { useState } from "react";
import { Card } from "@/components/ui/card";
import { AudioButton } from "@/components/ui/AudioButton";
import {
  Flashcard as FlashcardType,
  FlashcardFormat,
  FlashcardSide,
} from "@/app/constants/Flashcard";

export function Flashcard({
  flashcard,
  format,
}: {
  flashcard: FlashcardType;
  format: FlashcardFormat;
}) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const getContent = (side: "front" | "back") => {
    const fields = side === "front" ? format.front : format.back;
    return fields.map((field: FlashcardSide) => {
      switch (field) {
        case "term_native":
          return flashcard.term_native;
        case "term_learning_language":
          return flashcard.term_learning_language;
        case "example_sentence_learning_language":
          return flashcard.example_sentence_learning_language;
        default:
          return "";
      }
    });
  };

  const renderSide = (side: "front" | "back") => {
    const content = getContent(side);
    const audio =
      side === "front" ? flashcard.term_audio : flashcard.sentence_audio;

    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-4 relative">
        <div className="text-center">
          {content.map((item, index) => (
            <p
              key={index}
              className={
                index === 0
                  ? "text-xl sm:text-2xl md:text-3xl font-bold mb-2"
                  : "text-sm sm:text-base md:text-lg"
              }
            >
              {item}
            </p>
          ))}
        </div>
        {audio && (
          <div className="absolute top-4 right-4">
            <AudioButton audioData={audio} />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flip-card w-full max-w-[400px] aspect-[5/3] mb-8">
      <Card
        className={`flip-card-inner h-full ${isFlipped ? "flipped" : ""}`}
        onClick={handleFlip}
      >
        <div className="flip-card-front w-full h-full">
          {renderSide("front")}
        </div>
        <div className="flip-card-back w-full h-full">{renderSide("back")}</div>
      </Card>
    </div>
  );
}
