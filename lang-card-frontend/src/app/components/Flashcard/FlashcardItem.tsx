import AudioButton from "./AudioButton";
import Image from "next/image";

const FlashcardItem = ({
  frontPrimary,
  frontSecondary,
  frontAudio,
  backPrimary,
  backSecondary,
  backAudio,
  active,
  onToggleActive,
}: {
  frontPrimary: string;
  frontSecondary?: string;
  frontAudio?: string;
  backPrimary: string;
  backSecondary?: string;
  backAudio?: string;
  active: boolean;
  onToggleActive: () => void;
}) => {
  return (
    <div className="flex items-center gap-2 w-full">
      <div
        className={`w-full relative rounded-[10px] ${!active && "opacity-50"}`}
      >
        <div className="flex items-center rounded-[10px] shadow-sm text-center bg-gray-100 w-full">
          <div className="text-white text-xl font-semibold bg-primary-red w-[25%] py-4 rounded-l-[10px] flex flex-col items-center">
            <p>{frontPrimary}</p>
            <p className="text-lg font-md">{frontSecondary}</p>
            {frontAudio && <AudioButton audioData={frontAudio} color="white" />}
          </div>

          <div className="w-full text-gray-700 text-lg flex flex-col items-center">
            <p>{backPrimary}</p>
            <p>{backSecondary}</p>
            {backAudio && <AudioButton audioData={backAudio} color="black" />}
          </div>
        </div>
      </div>

      <button
        onClick={onToggleActive}
        className={`px-2 py-1 ${
          active ? "bg-secondary-red" : "bg-secondary-green"
        } rounded-[100px] flex items-center justify-center`}
      >
        {active ? (
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
