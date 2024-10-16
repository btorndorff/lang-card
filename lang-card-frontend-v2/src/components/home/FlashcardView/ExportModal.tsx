import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Flashcard, FlashcardFormat } from "@/app/constants/Flashcard";
import useExportFlashcards from "@/hooks/useExportFlashcards";
import { Check, Copy, Download, ExternalLink } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function Step1Content({
  selectedFormat,
  setSelectedFormat,
  handleNext,
}: {
  selectedFormat: "anki" | "quizlet" | null;
  setSelectedFormat: (format: "anki" | "quizlet" | null) => void;
  handleNext: () => void;
}) {
  return (
    <div className="flex flex-col space-y-4 justify-center items-center">
      <div className="flex gap-3">
        {["quizlet", "anki"].map((format) => (
          <div
            key={format}
            className={`flex flex-col items-center justify-center w-40 h-40 border-2 rounded-lg cursor-pointer ${
              selectedFormat === format ? "border-blue-500" : "border-gray-300"
            }`}
            onClick={() => setSelectedFormat(format as "quizlet" | "anki")}
          >
            <Image
              src={`/${format}_logo.svg`}
              alt={`${format} logo`}
              width={80}
              height={80}
            />
            <span className="mt-2 capitalize">{format}</span>
          </div>
        ))}
      </div>
      <Button onClick={handleNext} disabled={!selectedFormat}>
        Next
      </Button>
    </div>
  );
}

function AnkiExportContent({ handleExport }: { handleExport: () => void }) {
  const [isExporting, setIsExporting] = useState(false);

  const handleAnkiExport = async () => {
    setIsExporting(true);
    await handleExport();
    setIsExporting(false);
  };

  return (
    <Tabs defaultValue="instructions" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="instructions">Instructions</TabsTrigger>
        <TabsTrigger value="demo">Video Demo</TabsTrigger>
      </TabsList>
      <TabsContent value="instructions">
        <div className="flex flex-col space-y-4">
          <ol className="list-decimal list-inside space-y-2">
            <li>
              Click &quot;Export to Anki&quot; below to download the .apkg file
            </li>
            <li>Open Anki on your computer</li>
            <li>In Anki, click &quot;File&quot; &gt; &quot;Import&quot;</li>
            <li>Select the downloaded .apkg file</li>
            <li>Your flashcards will be added as a new deck in Anki</li>
          </ol>
        </div>
      </TabsContent>
      <TabsContent value="demo">
        <div className="flex justify-center items-center">
          <video autoPlay muted>
            <source src="/export_anki_demo.mov" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </TabsContent>
      <div className="flex justify-center mt-4">
        <Button onClick={handleAnkiExport} disabled={isExporting}>
          <Download className="h-4 w-4 mr-2" />
          {isExporting ? "Exporting..." : "Export to Anki"}
        </Button>
      </div>
    </Tabs>
  );
}

function QuizletExportContent({ handleExport }: { handleExport: () => void }) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    await handleExport();
    setIsCopied(true);
  };

  const handleQuizletRedirect = () => {
    window.open("https://quizlet.com/create-set", "_blank");
  };

  return (
    <Tabs defaultValue="instructions" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="instructions">Instructions</TabsTrigger>
        <TabsTrigger value="demo">Video Demo</TabsTrigger>
      </TabsList>
      <TabsContent value="instructions">
        <div className="flex flex-col space-y-4">
          <ol className="list-decimal list-inside space-y-2">
            <li>Click &quot;Copy Flashcards&quot; below</li>
            <li>Click &quot;Go to Quizlet&quot; to open the import page</li>
            <li>Paste the copied content into Quizlet&apos;s import box</li>
            <li>
              Set delimiters: Comma (Term/Definition), Semicolon (Between Cards)
            </li>
            <li>Click &quot;Import&quot; on Quizlet to create your set</li>
          </ol>
        </div>
      </TabsContent>
      <TabsContent value="demo">
        <div className="flex justify-center items-center">
          <video autoPlay muted>
            <source src="/export_quizlet_demo.mov" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </TabsContent>
      <div className="flex justify-center mt-4">
        <div className="space-x-2">
          <Button onClick={handleCopy}>
            {isCopied ? (
              <Check className="h-4 w-4 mr-2" />
            ) : (
              <Copy className="h-4 w-4 mr-2" />
            )}
            Copy Flashcards
          </Button>
          <Button onClick={handleQuizletRedirect} disabled={!isCopied}>
            <ExternalLink className="h-4 w-4 mr-2" />
            Go to Quizlet
          </Button>
        </div>
      </div>
    </Tabs>
  );
}

export function ExportModal({
  isOpen,
  setIsOpen,
  flashcards,
  flashcardFormat,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  flashcards: Flashcard[];
  flashcardFormat: FlashcardFormat;
}) {
  const [selectedFormat, setSelectedFormat] = useState<
    "anki" | "quizlet" | null
  >(null);
  const [step, setStep] = useState(1);
  const { handleAnkiExport, handleQuizletExport } = useExportFlashcards();

  const handleExport = async () => {
    if (!selectedFormat) return;
    if (selectedFormat === "anki") {
      await handleAnkiExport(flashcards, flashcardFormat);
    } else {
      await handleQuizletExport(flashcards);
    }
  };

  const handleNext = () => {
    if (selectedFormat) {
      setStep(2);
    }
  };

  useEffect(() => {
    setStep(1);
    setSelectedFormat(null);
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Export Flashcards</DialogTitle>
          <DialogDescription>
            {step === 1
              ? "Select the format you want to export to:"
              : selectedFormat === "anki"
              ? "Exporting to Anki"
              : "Exporting to Quizlet"}
          </DialogDescription>
        </DialogHeader>
        {step === 1 ? (
          <Step1Content
            selectedFormat={selectedFormat}
            setSelectedFormat={setSelectedFormat}
            handleNext={handleNext}
          />
        ) : selectedFormat === "anki" ? (
          <AnkiExportContent handleExport={handleExport} />
        ) : (
          <QuizletExportContent handleExport={handleExport} />
        )}
      </DialogContent>
    </Dialog>
  );
}
