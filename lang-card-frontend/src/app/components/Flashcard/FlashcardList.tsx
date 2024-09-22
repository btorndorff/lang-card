import { Flashcard as FlashcardType } from "../../constants/Flashcard";
import { exportFlashcards as exportFlashcardsAPI } from "../../api";
import FlashcardItem from "./FlashcardItem";
import Flashcard from "./Flashcard";
import FlashcardDisplay from "./FlashcardDisplay";

const FlashcardList = ({
  flashcards,
  error,
  loading,
  onToggleActive,
  handleReset,
}: {
  flashcards: FlashcardType[] | undefined | null;
  error: string | null;
  loading: boolean;
  onToggleActive: (index: number) => void;
  handleReset: () => void;
}): React.ReactElement | null => {
  const exportFlashcards = async () => {
    if (flashcards) {
      const activeFlashcards = flashcards.filter((fc) => fc.active);
      try {
        const blob = await exportFlashcardsAPI(activeFlashcards);
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `flashcards_${Date.now()}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Error exporting flashcards:", error);
        alert("Failed to export flashcards. Please try again later.");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-[300px]">
        <div className="lds-ellipsis">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    );
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!flashcards) {
    return <p>None</p>;
  }

  return (
    <div className="flex flex-col items-center py-5 w-full">
      <div className="flex flex-col gap-3 py-3 w-[80%] items-center">
        <FlashcardDisplay flashcards={flashcards} />
        <ul className="space-y-3 w-full flex flex-col items-center">
          {flashcards?.map((flashcard, index) => (
            <FlashcardItem
              frontPrimary={flashcard.front.primary}
              frontSecondary={flashcard.front.secondary ?? undefined}
              frontAudio={flashcard.front.audio}
              backPrimary={flashcard.back.primary}
              backSecondary={flashcard.back.secondary ?? undefined}
              backAudio={flashcard.back.audio}
              active={flashcard.active}
              onToggleActive={() => onToggleActive(index)}
              key={index}
            />
          ))}
        </ul>
      </div>
      <div className="flex gap-3">
        <button
          onClick={exportFlashcards}
          className="px-5 py-2 font-semibold bg-secondary-red rounded-[25px] text-white mt-3"
        >
          Export
        </button>
        <button
          onClick={handleReset}
          className="px-5 py-2 font-semibold border border-2 border-secondary-red rounded-[25px] text-secondary-red mt-3 hover:bg-secondary-red hover:text-white"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default FlashcardList;
