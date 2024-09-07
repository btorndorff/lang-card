import React, { useState } from "react";
import AudioUpload from "./AudioUpload";
import TextInput from "./TextInput";

const TabSelector = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: "audio" | "text";
  setActiveTab: React.Dispatch<React.SetStateAction<"audio" | "text">>;
}) => (
  <div className="flex mb-4">
    <label className="flex items-center cursor-pointer">
      <input
        type="radio"
        name="inputType"
        value="audio"
        checked={activeTab === "audio"}
        onChange={() => setActiveTab("audio")}
        className="hidden"
      />
      <span
        className={`py-2 px-4 border border-2 border-secondary-red rounded-l-lg ${
          activeTab === "audio"
            ? "bg-secondary-red text-white"
            : "text-primary-grey"
        }`}
      >
        Audio Upload
      </span>
    </label>
    <label className="flex items-center cursor-pointer">
      <input
        type="radio"
        name="inputType"
        value="text"
        checked={activeTab === "text"}
        onChange={() => setActiveTab("text")}
        className="hidden"
      />
      <span
        className={`py-2 px-4 border border-2 border-secondary-red rounded-r-lg ${
          activeTab === "text"
            ? "bg-secondary-red text-white"
            : "text-primary-grey"
        }`}
      >
        Text Input
      </span>
    </label>
  </div>
);

const InputSelector = ({
  audioFile,
  setAudioFile,
  text,
  setText,
}: {
  audioFile: File | undefined;
  setAudioFile: React.Dispatch<React.SetStateAction<File | undefined>>;
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [activeTab, setActiveTab] = useState<"audio" | "text">("audio");

  return (
    <div className="flex flex-col gap-5 items-center justify-center w-full">
      <TabSelector activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === "audio" ? (
        <AudioUpload audioFile={audioFile} setAudioFile={setAudioFile} />
      ) : (
        <TextInput text={text} setText={setText} />
      )}
    </div>
  );
};

export default InputSelector;
