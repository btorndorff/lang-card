import { useRouter } from "next/navigation";

const NavigationButtons = ({
  currentPage,
  onBack,
  onNext,
  isNextDisabled,
}: {
  currentPage: number;
  onBack: () => void;
  onNext: () => void;
  isNextDisabled: boolean;
}) => (
  <div className="flex items-center gap-3 mt-3">
    {currentPage > 1 && (
      <button
        onClick={onBack}
        className="px-5 py-2 font-semibold rounded-[25px] text-secondary-red border border-secondary-red hover:text-white hover:bg-secondary-red"
      >
        Back
      </button>
    )}
    <button
      onClick={onNext}
      disabled={isNextDisabled}
      className={`px-5 py-2 font-semibold  rounded-[25px] text-white ${
        isNextDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-secondary-red"
      }`}
    >
      {currentPage === 3 ? "Generate Flashcards" : "Continue"}
    </button>
  </div>
);

export default NavigationButtons;
