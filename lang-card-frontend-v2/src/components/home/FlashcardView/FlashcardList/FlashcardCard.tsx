import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { AudioButton } from "@/components/ui/AudioButton";
import {
  Flashcard,
  FlashcardFormat,
  FlashcardSide,
} from "@/app/constants/Flashcard";

export function FlashcardCard({
  flashcard,
  index,
  toggleFlashcardActive,
  format,
}: {
  flashcard: Flashcard;
  index: number;
  toggleFlashcardActive: (index: number) => void;
  format: FlashcardFormat;
}) {
  const getContent = (side: FlashcardSide[]) => {
    return side.map((item) => {
      switch (item) {
        case "term_native":
          return flashcard.term_native;
        case "term_learning_language":
          return flashcard.term_learning_language;
        case "example_sentence_learning_language":
          return flashcard.example_sentence_learning_language;
      }
    });
  };

  return (
    <div className="flex items-center space-x-4">
      <Card
        className={`w-full overflow-hidden ${
          flashcard.active ? "" : "opacity-50"
        }`}
      >
        <CardContent className="p-0 flex flex-col sm:flex-row">
          <div className="bg-primary text-primary-foreground flex flex-col items-center justify-center sm:w-1/3 p-4">
            <div className="flex flex-col items-center w-full">
              {getContent(format.front).map((content, index) => (
                <div
                  key={index}
                  className="flex items-center justify-center w-full mb-2"
                >
                  <h2
                    className={`text-center ${
                      index === 0 ? "text-2xl font-bold" : "text-lg"
                    }`}
                  >
                    {content}
                  </h2>
                  {content === flashcard.term_learning_language &&
                    flashcard.term_audio && (
                      <AudioButton
                        audioData={flashcard.term_audio}
                        color="white"
                        size={22}
                        className="ml-2"
                      />
                    )}
                  {content === flashcard.example_sentence_learning_language &&
                    flashcard.sentence_audio && (
                      <AudioButton
                        audioData={flashcard.sentence_audio}
                        color="white"
                        size={18}
                        className="ml-2"
                      />
                    )}
                </div>
              ))}
            </div>
          </div>
          <div className="bg-background p-4 flex flex-col justify-center sm:w-2/3 flex-grow">
            {getContent(format.back).map((content, index) => (
              <div
                key={index}
                className="flex items-center justify-center mb-2"
              >
                <p
                  className={
                    index === 0
                      ? "text-xl font-semibold text-center"
                      : "text-sm sm:text-base md:text-lg text-muted-foreground text-center"
                  }
                >
                  {content}
                </p>
                {content === flashcard.term_learning_language &&
                  flashcard.term_audio && (
                    <AudioButton
                      audioData={flashcard.term_audio}
                      color={index === 0 ? "black" : "hsl(0 0% 45.1%)"}
                      size={18}
                      className="ml-2"
                    />
                  )}
                {content === flashcard.example_sentence_learning_language &&
                  flashcard.sentence_audio && (
                    <AudioButton
                      audioData={flashcard.sentence_audio}
                      color="hsl(0 0% 45.1%)"
                      size={18}
                      className="ml-2"
                    />
                  )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Button
        variant="outline"
        size="icon"
        onClick={() => toggleFlashcardActive(index)}
      >
        {flashcard.active ? (
          <X className="h-4 w-4" />
        ) : (
          <Plus className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
