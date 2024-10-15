import { toast } from "@/hooks/use-toast";
import { Flashcard, FlashcardFormat } from "@/app/constants/Flashcard";
import { API_URL } from "@/app/constants/API";

export default function useExportFlashcards() {
  const handleAnkiExport = async (
    flashcards: Flashcard[],
    format: FlashcardFormat
  ) => {
    try {
      const response = await fetch(`${API_URL}/export_anki`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ flashcards: flashcards, format: format }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;

      // Get the filename from the Content-Disposition header if available
      const contentDisposition = response.headers.get("Content-Disposition");
      let filename = "langcard_flashcards.apkg";
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/i);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Success",
        description: "Flashcards exported successfully to Anki.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error exporting flashcards to Anki:", error);
      toast({
        title: "Error",
        description:
          "Failed to export flashcards to Anki. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleQuizletExport = async (flashcards: Flashcard[]) => {
    try {
      // Format flashcards for Quizlet
      const formattedFlashcards = flashcards
        .map(
          (fc) =>
            `${fc.term_learning_language},${fc.term_native}\n${fc.example_sentence_learning_language}`
        )
        .join(";");

      // Copy to clipboard
      await navigator.clipboard.writeText(formattedFlashcards);

      toast({
        title: "Success",
        description: "Flashcards copied to clipboard for Quizlet import.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error copying flashcards for Quizlet:", error);
      toast({
        title: "Error",
        description:
          "Failed to copy flashcards for Quizlet. Please try again later.",
        variant: "destructive",
      });
    }
  };

  return { handleAnkiExport, handleQuizletExport };
}
