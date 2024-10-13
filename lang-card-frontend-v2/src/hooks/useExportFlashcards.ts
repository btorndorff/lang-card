import { toast } from "@/hooks/use-toast";
import { Flashcard } from "@/app/constants/Flashcard";
import { API_URL } from "@/app/constants/API";

export default function useExportFlashcards() {
  const handleExport = async (flashcards: Flashcard[]) => {
    try {
      const response = await fetch(`${API_URL}/export_anki`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ flashcards: flashcards }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;

      const currentTime = new Date().getTime();
      const filename = `flashcards_${currentTime}.txt`;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Success",
        description: "Flashcards exported successfully.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error exporting flashcards:", error);
      toast({
        title: "Error",
        description: "Failed to export flashcards. Please try again later.",
        variant: "destructive",
      });
    }
  };

  return handleExport;
}
