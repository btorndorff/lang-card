import React, { useState } from "react";
import Image from "next/image";
import UploadIcon from "../../../../public/upload.svg";

const FileInput = ({
  onChange,
}: {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <label className="cursor-pointer">
    <span className="px-5 py-2 border border-primary-grey text-primary-grey font-semibold rounded-md border-2 rounded-[25px] inline-block">
      Browse File
    </span>
    <input
      type="file"
      accept="audio/*"
      className="hidden"
      onChange={onChange}
    />
  </label>
);

const UploadedAudioFile = ({
  audioFile,
  setAudioFile,
}: {
  audioFile?: File;
  setAudioFile: React.Dispatch<React.SetStateAction<File | undefined>>;
}) => {
  if (!audioFile) return null;

  return (
    <div className="border border-secondary-red w-100 flex gap-5 justify-center items-center px-5 py-2 border-2 rounded-[40px]">
      <p className="text-xl text-center text-primary-grey">{audioFile.name}</p>
      <button
        onClick={() => setAudioFile(undefined)}
        className="px-3 py-2 border border-primary-grey text-primary-grey font-semibold rounded-md border-2 rounded-[25px] hover:bg-secondary-red hover:border-secondary-red hover:text-white"
      >
        Change File
      </button>
    </div>
  );
};

const NoAudioFile = ({
  setAudioFile,
}: {
  setAudioFile: React.Dispatch<React.SetStateAction<File | undefined>>;
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setAudioFile(file);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) setAudioFile(file);
  };

  return (
    <div
      className={`upload-border w-full max-w-[60%] min-h-[200px] flex flex-col items-center justify-center space-y-3 p-4 ${
        isDragging ? "border-primary-grey bg-gray-100" : ""
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Image src={UploadIcon} alt="Upload icon" width={40} height={40} />
      <p className="text-lg text-center text-primary-grey">
        Choose an audio file or drag & drop it here
      </p>
      <p className="text-sm text-center text-secondary-grey">
        Any audio type up to 25MB
      </p>
      <FileInput onChange={handleFileChange} />
    </div>
  );
};

const AudioUpload = ({
  audioFile,
  setAudioFile,
}: {
  audioFile?: File;
  setAudioFile: React.Dispatch<React.SetStateAction<File | undefined>>;
}) => {
  return (
    <div className="flex flex-col gap-5 items-center justify-center w-full">
      {audioFile ? (
        <UploadedAudioFile audioFile={audioFile} setAudioFile={setAudioFile} />
      ) : (
        <NoAudioFile setAudioFile={setAudioFile} />
      )}
    </div>
  );
};

export default AudioUpload;
