import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Settings } from "lucide-react";
import { Label } from "@/components/ui/label";
import { FlashcardFormat, FlashcardSide } from "@/app/constants/Flashcard";

const FlashcardPreview = ({
  side,
  content,
}: {
  side: "front" | "back";
  content: FlashcardSide[];
}) => {
  const orderedContent = [
    "term_native",
    "term_learning_language",
    "example_sentence_learning_language",
  ];

  const sortedContentArray = content.sort(
    (a, b) => orderedContent.indexOf(a) - orderedContent.indexOf(b)
  );

  return (
    <div className="border-2 border-primary rounded-lg p-4 w-48 h-64 flex flex-col items-center justify-center relative">
      <p className="text-sm text-muted-foreground absolute top-2 left-2">
        {side}
      </p>
      {sortedContentArray.map((item, index) => (
        <p
          key={index}
          className={index === 0 ? "text-lg font-bold mb-2" : "text-sm"}
        >
          {item === "term_native"
            ? "Native Term"
            : item === "term_learning_language"
            ? "Learning Term"
            : "Example Sentence"}
        </p>
      ))}
    </div>
  );
};

export function FlashcardFormatModal({
  isOpen,
  setIsOpen,
  format,
  setFormat,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  format: FlashcardFormat;
  setFormat: (format: FlashcardFormat) => void;
}) {
  const [tempFormat, setTempFormat] = useState<FlashcardFormat>(format);

  const handleSideChange = (side: "front" | "back", value: FlashcardSide) => {
    setTempFormat((prev) => {
      const newFormat = { ...prev };
      if (side === "front") {
        if (newFormat.front.includes(value)) {
          newFormat.front = newFormat.front.filter((item) => item !== value);
        } else {
          newFormat.front = [...newFormat.front, value];
        }
      } else {
        if (newFormat.back.includes(value)) {
          newFormat.back = newFormat.back.filter((item) => item !== value);
        } else {
          newFormat.back = [...newFormat.back, value];
        }
      }
      return newFormat;
    });
  };

  const handleSave = () => {
    setFormat(tempFormat);
    setIsOpen(false);
  };

  useEffect(() => {
    setTempFormat(format);
  }, [format]);

  const orderedSides = [
    "term_native",
    "term_learning_language",
    "example_sentence_learning_language",
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="p-4 bg-white rounded-lg shadow-md cursor-pointer hover:bg-gray-100 transition-colors duration-200 flex items-center">
          <Settings className="h-6 w-6 mr-4" />
          <div>
            <h2 className="text-xl font-semibold mb-2">Format Flashcards</h2>
            <p className="text-md text-muted-foreground">
              Customize your flashcards
            </p>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Format Flashcards</DialogTitle>
          <DialogDescription>
            Customize the appearance and content of your flashcards here.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="space-y-4 flex-1">
            <div>
              <h3 className="text-lg font-semibold mb-2">Front of Card</h3>
              <div className="space-y-2">
                {orderedSides.map((item) => (
                  <div key={item} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`front-${item}`}
                      checked={tempFormat.front.includes(item as FlashcardSide)}
                      onChange={() =>
                        handleSideChange("front", item as FlashcardSide)
                      }
                    />
                    <Label htmlFor={`front-${item}`}>
                      {item === "term_native"
                        ? "Native Term"
                        : item === "term_learning_language"
                        ? "Learning Language Term"
                        : "Example Sentence"}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Back of Card</h3>
              <div className="space-y-2">
                {orderedSides.map((item) => (
                  <div key={item} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`back-${item}`}
                      checked={tempFormat.back.includes(item as FlashcardSide)}
                      onChange={() =>
                        handleSideChange("back", item as FlashcardSide)
                      }
                    />
                    <Label htmlFor={`back-${item}`}>
                      {item === "term_native"
                        ? "Native Term"
                        : item === "term_learning_language"
                        ? "Learning Language Term"
                        : "Example Sentence"}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-4">
            <FlashcardPreview side="front" content={tempFormat.front} />
            <FlashcardPreview side="back" content={tempFormat.back} />
          </div>
        </div>
        <Button onClick={handleSave}>Save Format</Button>
      </DialogContent>
    </Dialog>
  );
}
