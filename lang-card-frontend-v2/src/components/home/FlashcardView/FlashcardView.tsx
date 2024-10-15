import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import { Flashcard, FlashcardFormat } from "@/app/constants/Flashcard";
import { useAddAudio } from "@/hooks/useAddAudio";
import { FlashcardsPreview } from "./FlashcardsPreview/FlashcardsPreview";
import { FlashcardList } from "./FlashcardList/FlashcardList";
import { Share, RefreshCw } from "lucide-react";
import { FlashcardFormatModal } from "./FlashcardFormatModal";
import { AddAudioModal } from "./AddAudioModal";
import { ExportModal } from "./ExportModal";

export function FlashcardsView({
  flashcards,
  setFlashcards,
  learningLanguage,
}: {
  flashcards: Flashcard[];
  setFlashcards: React.Dispatch<React.SetStateAction<Flashcard[]>>;
  learningLanguage: string;
}) {
  const [isFormatModalOpen, setIsFormatModalOpen] = useState(false);
  const [isAudioModalOpen, setIsAudioModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [audioAdded, setAudioAdded] = useState(false);
  const { isAddingAudio, handleAddAudio } = useAddAudio();
  const [flashcardFormat, setFlashcardFormat] = useState<FlashcardFormat>({
    front: ["term_learning_language"],
    back: ["term_native", "example_sentence_learning_language"],
  });

  const activeFlashcards = useMemo(
    () => flashcards.filter((flashcard) => flashcard.active),
    [flashcards]
  );

  const toggleFlashcardActive = (index: number) => {
    setFlashcards((prevFlashcards) =>
      prevFlashcards.map((flashcard, i) =>
        i === index ? { ...flashcard, active: !flashcard.active } : flashcard
      )
    );
  };

  const handleExportClick = () => {
    setIsExportModalOpen(true);
  };

  return (
    <div className="flex flex-col items-center p-4 w-full h-full md:overflow-hidden">
      <Image
        src="/lang_card_logo.svg"
        alt="LangCard Logo"
        width={400}
        height={200}
        className="mb-8 invert"
      />
      <div className="flex flex-col md:flex-row w-full max-w-7xl gap-8 flex-grow">
        <div className="w-full md:w-1/3 flex flex-col">
          <FlashcardsPreview flashcards={flashcards} format={flashcardFormat} />
          <div className="mt-4 flex flex-col gap-4 w-full">
            <FlashcardFormatModal
              isOpen={isFormatModalOpen}
              setIsOpen={setIsFormatModalOpen}
              format={flashcardFormat}
              setFormat={setFlashcardFormat}
            />
            <AddAudioModal
              isOpen={isAudioModalOpen}
              setIsOpen={setIsAudioModalOpen}
              isAddingAudio={isAddingAudio}
              handleAddAudio={handleAddAudio}
              activeFlashcards={activeFlashcards}
              learningLanguage={learningLanguage}
              setFlashcards={setFlashcards}
              audioAdded={audioAdded}
            />
          </div>
        </div>
        <div className="flex flex-col w-full md:w-2/3 md:h-[500px]">
          <div className="flex-grow overflow-y-auto">
            <FlashcardList
              flashcards={flashcards}
              toggleFlashcardActive={toggleFlashcardActive}
              format={flashcardFormat}
            />
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-auto pt-4 pb-4 space-x-4">
        <Button
          onClick={() => {
            setFlashcards([]);
            setAudioAdded(false);
          }}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Try Again</span>
        </Button>
        <Button
          onClick={handleExportClick}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Share className="h-4 w-4" />
          <span>Export</span>
        </Button>
      </div>
      <ExportModal
        isOpen={isExportModalOpen}
        setIsOpen={setIsExportModalOpen}
        flashcards={activeFlashcards}
        flashcardFormat={flashcardFormat}
      />
    </div>
  );
}
