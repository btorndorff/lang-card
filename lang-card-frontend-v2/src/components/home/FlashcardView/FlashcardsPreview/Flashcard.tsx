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
    const termAudio = flashcard.term_audio;
    const sentenceAudio = flashcard.sentence_audio;

    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-4">
        <div className="text-center">
          {content.map((item, index) => (
            <div key={index} className="flex items-center justify-center mb-2">
              <p
                className={
                  index === 0
                    ? "text-xl sm:text-2xl md:text-3xl font-bold"
                    : "text-sm sm:text-base md:text-lg"
                }
              >
                {item}
              </p>
              {index === 0 && termAudio && item !== flashcard.term_native && (
                <AudioButton audioData={termAudio} className="ml-2" />
              )}
              {item === flashcard.example_sentence_learning_language &&
                sentenceAudio && (
                  <AudioButton audioData={sentenceAudio} className="ml-2" />
                )}
            </div>
          ))}
        </div>
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
