import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";

function TextInput({
  inputText,
  setInputText,
}: {
  inputText: string;
  setInputText: (value: string) => void;
}) {
  return (
    <TabsContent value="text">
      <div className="space-y-2">
        <Label htmlFor="inputText">Input Text</Label>
        <Textarea
          id="inputText"
          placeholder="Enter text to generate flashcards"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          rows={5}
        />
      </div>
    </TabsContent>
  );
}

function AudioInput({
  audioFile,
  setAudioFile,
}: {
  audioFile: File | null;
  setAudioFile: (file: File | null) => void;
}) {
  return (
    <TabsContent value="audio">
      <div className="space-y-4">
        <Label htmlFor="audioFile" className="text-lg font-semibold">
          Upload Audio File
        </Label>
        {audioFile ? (
          <div className="flex flex-col items-center justify-center w-full p-4 border-2 border-gray-300 rounded-lg bg-gray-50">
            <p className="mb-2 text-sm text-gray-700">
              Current file:{" "}
              <span className="font-semibold">{audioFile.name}</span>
            </p>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => document.getElementById("audioFile")?.click()}
              >
                Change File
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAudioFile(null)}
              >
                Remove File
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="audioFile"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Image
                  src="/audio_upload.svg"
                  alt="Audio upload icon"
                  width={32}
                  height={32}
                  className="mb-4 text-gray-500"
                />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500">
                  .WAV, .MP3, .OGG, .M4A (MAX. 25MB)
                </p>
              </div>
            </label>
          </div>
        )}
        <Input
          id="audioFile"
          type="file"
          accept=".wav,.mp3,.ogg,.m4a"
          onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
          className="hidden"
        />
      </div>
    </TabsContent>
  );
}

function InputTypeSelector({
  inputType,
  setInputType,
  children,
}: {
  inputType: string;
  setInputType: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <Tabs value={inputType} onValueChange={setInputType} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="text">Text</TabsTrigger>
        <TabsTrigger value="audio">Audio</TabsTrigger>
      </TabsList>
      {children}
    </Tabs>
  );
}

export default function UserInputSection({
  inputType,
  setInputType,
  inputText,
  setInputText,
  audioFile,
  setAudioFile,
}: {
  inputType: string;
  setInputType: (value: string) => void;
  inputText: string;
  setInputText: (value: string) => void;
  audioFile: File | null;
  setAudioFile: (file: File | null) => void;
}) {
  return (
    <InputTypeSelector inputType={inputType} setInputType={setInputType}>
      <TextInput inputText={inputText} setInputText={setInputText} />
      <AudioInput audioFile={audioFile} setAudioFile={setAudioFile} />
    </InputTypeSelector>
  );
}
