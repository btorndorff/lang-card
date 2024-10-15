import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LanguageSelector from "./LanguageSelector";
import UserInputSection from "./UserInputSection";
import { Loader2, Hammer } from "lucide-react";

export function FlashcardForm({
  nativeLanguage,
  setNativeLanguage,
  learningLanguage,
  setLearningLanguage,
  inputType,
  setInputType,
  inputText,
  setInputText,
  audioFile,
  setAudioFile,
  isLoading,
  handleGenerateFlashcards,
}: {
  nativeLanguage: string;
  setNativeLanguage: React.Dispatch<React.SetStateAction<string>>;
  learningLanguage: string;
  setLearningLanguage: React.Dispatch<React.SetStateAction<string>>;
  inputType: string;
  setInputType: React.Dispatch<React.SetStateAction<string>>;
  inputText: string;
  setInputText: React.Dispatch<React.SetStateAction<string>>;
  audioFile: File | null;
  setAudioFile: React.Dispatch<React.SetStateAction<File | null>>;
  isLoading: boolean;
  handleGenerateFlashcards: (e: React.FormEvent) => Promise<void>;
}) {
  return (
    <>
      <Image
        src="/lang_card_logo.svg"
        alt="LangCard Logo"
        width={400}
        height={200}
        className="mb-8 invert"
      />
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-center">
            Generate Flashcards
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleGenerateFlashcards} className="space-y-4">
            <LanguageSelector
              label="Native Language"
              value={nativeLanguage}
              onChange={setNativeLanguage}
            />
            <LanguageSelector
              label="What language are you learning?"
              value={learningLanguage}
              onChange={setLearningLanguage}
              error={
                nativeLanguage &&
                learningLanguage &&
                nativeLanguage === learningLanguage
                  ? "Native and learning languages cannot be the same"
                  : ""
              }
            />
            <UserInputSection
              inputType={inputType}
              setInputType={setInputType}
              inputText={inputText}
              setInputText={setInputText}
              audioFile={audioFile}
              setAudioFile={setAudioFile}
            />
            <Button
              type="submit"
              className="w-full flex items-center justify-center gap-2"
              disabled={
                isLoading ||
                !nativeLanguage ||
                !learningLanguage ||
                nativeLanguage === learningLanguage ||
                (inputType === "text" && !inputText) ||
                (inputType === "audio" && !audioFile)
              }
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Hammer className="h-4 w-4" />
                  <span>Generate Flashcards</span>
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
