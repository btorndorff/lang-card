import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Volume2, Check, Loader2 } from "lucide-react";
import { Flashcard } from "@/app/constants/Flashcard";

export function AddAudioModal({
  isOpen,
  setIsOpen,
  isAddingAudio,
  handleAddAudio,
  activeFlashcards,
  learningLanguage,
  setFlashcards,
  audioAdded,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isAddingAudio: boolean;
  handleAddAudio: (
    flashcards: Flashcard[],
    language: string,
    setFlashcards: React.Dispatch<React.SetStateAction<Flashcard[]>>
  ) => void;
  activeFlashcards: Flashcard[];
  learningLanguage: string;
  setFlashcards: React.Dispatch<React.SetStateAction<Flashcard[]>>;
  audioAdded: boolean;
}) {
  const handleAddAudioClick = () => {
    handleAddAudio(activeFlashcards, learningLanguage, setFlashcards);
    setIsOpen(false);
  };

  const getIcon = () => {
    if (audioAdded) return <Check className="h-6 w-6 mr-4 text-green-500" />;
    if (isAddingAudio) return <Loader2 className="h-6 w-6 mr-4 animate-spin" />;
    return <Volume2 className="h-6 w-6 mr-4" />;
  };

  const getTitle = () => {
    if (audioAdded) return "Audio Added";
    if (isAddingAudio) return "Adding Audio...";
    return "Add Audio";
  };

  const getDescription = () => {
    if (audioAdded) return "Audio enhancement complete";
    if (isAddingAudio) return "Processing audio...";
    return "Enhance with audio";
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div
          className={`p-4 bg-white rounded-lg shadow-md cursor-pointer hover:bg-gray-100 transition-colors duration-200 flex items-center ${
            audioAdded || isAddingAudio ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={(e) => {
            if (audioAdded || isAddingAudio) {
              e.preventDefault();
            }
          }}
        >
          {getIcon()}
          <div>
            <h3 className="text-lg font-semibold">{getTitle()}</h3>
            <p className="text-sm text-gray-600">{getDescription()}</p>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Audio to Flashcards</DialogTitle>
          <DialogDescription>
            Add audio pronunciations to your flashcards.
          </DialogDescription>
        </DialogHeader>
        <div>
          <p className="text-sm">*Audio cannot be exported to Quizlet.</p>
        </div>
        <Button
          onClick={handleAddAudioClick}
          disabled={isAddingAudio || audioAdded}
        >
          {isAddingAudio ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Adding Audio...
            </>
          ) : audioAdded ? (
            "Audio Added"
          ) : (
            "Add Audio"
          )}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
