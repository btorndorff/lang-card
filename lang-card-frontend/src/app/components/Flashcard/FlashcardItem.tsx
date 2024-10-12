import AudioButton from "./AudioButton";
import Image from "next/image";
import { Flashcard } from "../../constants/Flashcard";

const FlashcardItem = ({
  flashcard,
  onToggleActive,
}: {
  flashcard: Flashcard;
  onToggleActive: () => void;
}) => {
  return (
    <div className="flex items-center gap-2 w-full">
      <div
        className={`w-full relative rounded-[10px] ${
          !flashcard.active && "opacity-50"
        }`}
      >
        <div className="flex items-center rounded-[10px] shadow-sm text-center bg-gray-100 w-full">
          <div className="text-white text-xl font-semibold bg-primary-red w-[25%] py-4 rounded-l-[10px] flex flex-col items-center">
            <p>{flashcard.term_native}</p>
            {flashcard.front.audio && (
              <AudioButton audioData={flashcard.front.audio} color="white" />
            )}
          </div>

          <div className="w-full text-gray-700 text-lg flex flex-col items-center">
            <p>{flashcard.term_learning_language}</p>
            <p>{flashcard.example_sentence_learning_language}</p>
            {flashcard.back.audio && (
              <AudioButton audioData={flashcard.back.audio} color="black" />
            )}
          </div>
        </div>
      </div>

      <button
        onClick={onToggleActive}
        className={`px-2 py-1 ${
          flashcard.active ? "bg-secondary-red" : "bg-secondary-green"
        } rounded-[100px] flex items-center justify-center`}
      >
        {flashcard.active ? (
          <Image src="/x.svg" alt="Deactivate" width={20} height={20} />
        ) : (
          <Image
            src="/x.svg"
            alt="Activate"
            width={20}
            height={20}
            style={{ transform: "rotate(45deg)" }}
          />
        )}
      </button>
    </div>
  );
};

export default FlashcardItem;
