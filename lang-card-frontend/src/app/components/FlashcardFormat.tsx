import React, { useEffect, useState } from "react";
import { SupportedLanguagesType } from "../constants/SUPPORTED_LANGUAGES";
import {
  Flashcard,
  FlashcardContent,
  FlashcardContentValue,
  FlashcardSide,
} from "../constants/Flashcard";
import Sound from "../../../public/sound.svg";
import Image from "next/image";

const FlashcardTemplate = ({
  primary,
  secondary,
  audio,
  dashed,
}: {
  primary: string;
  secondary?: string;
  audio: boolean;
  dashed?: boolean;
}) => {
  return (
    <div
      className={`relative ${
        dashed
          ? "flashcard-border"
          : "border border-primary-red border-8 rounded-[25px]"
      }`}
      style={{
        width: "80vw",
        maxWidth: "200px",
        aspectRatio: "4 / 5",
      }}
    >
      {audio && (
        <div className="absolute top-0 right-0 p-5">
          <Image src={Sound} alt="Sound" />
        </div>
      )}
      <div className="flex flex-col justify-center items-center h-full">
        <p className="font-bold text-5xl text-primary-grey">{primary}</p>
        <p className="font-semibold text-lg text-secondary-grey">{secondary}</p>
      </div>
    </div>
  );
};

const FlashcardFormat = ({
  nativeLanguage,
  learningLanguage,
  setFlashcardFormat,
  setAudioToggle,
}: {
  nativeLanguage: string;
  learningLanguage?: SupportedLanguagesType;
  setFlashcardFormat: (format: typeof FlashcardFormat) => void;
  setAudioToggle: (on: boolean) => void;
}) => {
  const [front, setFront] = useState<FlashcardSide>({
    primary: FlashcardContent.LEARNING_LANGUAGE,
    secondary: null,
  });
  const [back, setBack] = useState<FlashcardSide>({
    primary: FlashcardContent.NATIVE_LANGUAGE,
    secondary: FlashcardContent.EXAMPLE_SENTENCE,
  });
  const [audio, setAudio] = useState("off");

  const handlePrimaryChange = (
    side: "front" | "back",
    value: Exclude<
      FlashcardContentValue,
      typeof FlashcardContent.EXAMPLE_SENTENCE
    >
  ) => {
    if (side === "front") {
      setFront((prev) => ({
        ...prev,
        primary: value,
      }));

      if (value === back.primary) {
        setBack((prev) => ({
          ...prev,
          primary: front.primary,
        }));
      }
    } else {
      setBack((prev) => ({
        ...prev,
        primary: value,
      }));

      if (value === front.primary) {
        setFront((prev) => ({
          ...prev,
          primary: back.primary,
        }));
      }
    }
  };

  const handleExampleSentenceChange = (value: string) => {
    if (value === "front") {
      setFront((prev) => ({
        ...prev,
        secondary: FlashcardContent.EXAMPLE_SENTENCE,
      }));
      setBack((prev) => ({
        ...prev,
        secondary: null,
      }));
    } else if (value === "back") {
      setFront((prev) => ({
        ...prev,
        secondary: null,
      }));
      setBack((prev) => ({
        ...prev,
        secondary: FlashcardContent.EXAMPLE_SENTENCE,
      }));
    } else {
      setFront((prev) => ({
        ...prev,
        secondary: null,
      }));
      setBack((prev) => ({
        ...prev,
        secondary: null,
      }));
    }
  };

  useEffect(() => {
    setFlashcardFormat({
      front,
      back,
      active: true,
    });
  }, [front, back]);

  useEffect(() => {
    const toggle = audio === "on" ? true : false;
    setAudioToggle(toggle);
  }, [audio]);

  if (!learningLanguage || !nativeLanguage) return null;

  return (
    <div className="flex flex-col gap-5 items-center justify-center w-full">
      <p className="text-xl text-center font-semibold text-primary-gray">
        Flashcard Format
      </p>

      <div className="flex flex-col sm:flex-row justify-center lg:items-center gap-10">
        <div className="flex gap-3">
          <div className="flex flex-col gap-1">
            <p className="text-center text-primary-grey">Front</p>

            <FlashcardTemplate
              primary={
                front.primary === FlashcardContent.LEARNING_LANGUAGE
                  ? "あ"
                  : "A"
              }
              secondary={front.secondary || undefined}
              audio={audio == "on"}
            />
          </div>

          <div className="flex flex-col gap-1">
            <p className="text-center text-primary-grey">Back</p>

            <FlashcardTemplate
              primary={
                back.primary === FlashcardContent.LEARNING_LANGUAGE ? "あ" : "A"
              }
              secondary={(back.secondary && "example sentence") || undefined}
              dashed
              audio={audio == "on"}
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 p-5 sm:p-0">
          <div>
            <p className="text-primary-grey">Learning Language</p>
            <div className="flex">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="learning-language-front-back"
                  value={FlashcardContent.LEARNING_LANGUAGE}
                  checked={front.primary === FlashcardContent.LEARNING_LANGUAGE}
                  onChange={() =>
                    handlePrimaryChange(
                      "front",
                      FlashcardContent.LEARNING_LANGUAGE
                    )
                  }
                  className="hidden"
                />
                <span
                  className={`py-2 px-4 border border-2 border-secondary-red rounded-l-lg ${
                    front.primary === FlashcardContent.LEARNING_LANGUAGE
                      ? "bg-secondary-red text-white"
                      : "text-primary-grey"
                  }`}
                >
                  Front
                </span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="learning-language-front-back"
                  value={FlashcardContent.LEARNING_LANGUAGE}
                  checked={back.primary === FlashcardContent.LEARNING_LANGUAGE}
                  onChange={() =>
                    handlePrimaryChange(
                      "back",
                      FlashcardContent.LEARNING_LANGUAGE
                    )
                  }
                  className="hidden"
                />
                <span
                  className={`py-2 px-4 border border-2 border-secondary-red rounded-r-lg ${
                    back.primary === FlashcardContent.LEARNING_LANGUAGE
                      ? "bg-secondary-red text-white"
                      : "text-primary-grey"
                  }`}
                >
                  Back
                </span>
              </label>
            </div>
          </div>

          <div>
            <p className="text-primary-grey">Native Language</p>
            <div className="flex">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="native-language-front-back"
                  value={FlashcardContent.NATIVE_LANGUAGE}
                  checked={front.primary === FlashcardContent.NATIVE_LANGUAGE}
                  onChange={() =>
                    handlePrimaryChange(
                      "front",
                      FlashcardContent.NATIVE_LANGUAGE
                    )
                  }
                  className="hidden"
                />
                <span
                  className={`py-2 px-4 border border-2 border-secondary-red rounded-l-lg ${
                    front.primary === FlashcardContent.NATIVE_LANGUAGE
                      ? "bg-secondary-red text-white"
                      : "text-primary-grey"
                  }`}
                >
                  Front
                </span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="native-language-front-back"
                  value={FlashcardContent.NATIVE_LANGUAGE}
                  checked={back.primary === FlashcardContent.NATIVE_LANGUAGE}
                  onChange={() =>
                    handlePrimaryChange(
                      "back",
                      FlashcardContent.NATIVE_LANGUAGE
                    )
                  }
                  className="hidden"
                />
                <span
                  className={`py-2 px-4 border border-2 border-secondary-red rounded-r-lg ${
                    back.primary === FlashcardContent.NATIVE_LANGUAGE
                      ? "bg-secondary-red text-white"
                      : "text-primary-grey"
                  }`}
                >
                  Back
                </span>
              </label>
            </div>
          </div>

          <div>
            <p className="text-primary-grey">Example Sentence</p>
            <div className="flex">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="example-sentence"
                  value="front"
                  checked={
                    front.secondary === FlashcardContent.EXAMPLE_SENTENCE
                  }
                  onChange={() => handleExampleSentenceChange("front")}
                  className="hidden"
                />
                <span
                  className={`py-2 px-4 border-t-2 border-b-2 border-l-2 border-secondary-red rounded-l-lg ${
                    front.secondary === FlashcardContent.EXAMPLE_SENTENCE
                      ? "bg-secondary-red text-white"
                      : "text-primary-grey"
                  }`}
                >
                  Front
                </span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="example-sentence"
                  value="back"
                  checked={back.secondary === FlashcardContent.EXAMPLE_SENTENCE}
                  onChange={() => handleExampleSentenceChange("back")}
                  className="hidden"
                />
                <span
                  className={`py-2 px-4 border-y-2 border-secondary-red ${
                    back.secondary === FlashcardContent.EXAMPLE_SENTENCE
                      ? "bg-secondary-red text-white"
                      : "text-primary-grey"
                  }`}
                >
                  Back
                </span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="example-sentence"
                  value="none"
                  checked={!front.secondary && !back.secondary}
                  onChange={() => handleExampleSentenceChange("none")}
                  className="hidden"
                />
                <span
                  className={`py-2 px-4 border-t-2 border-b-2 border-r-2 border-secondary-red rounded-r-lg ${
                    !front.secondary && !back.secondary
                      ? "bg-secondary-red text-white"
                      : "text-primary-grey"
                  }`}
                >
                  None
                </span>
              </label>
            </div>
          </div>

          <div>
            <p className="text-primary-grey">Audio</p>
            <div className="flex ">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="audio"
                  value="on"
                  checked={audio === "on"}
                  onChange={() => setAudio("on")}
                  className="hidden"
                />
                <span
                  className={`py-2 px-4 border border-2 border-secondary-red rounded-l-lg ${
                    audio === "on"
                      ? "bg-secondary-red text-white"
                      : "text-primary-grey"
                  }`}
                >
                  On
                </span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="audio"
                  value="off"
                  checked={audio === "off"}
                  onChange={() => setAudio("off")}
                  className="hidden"
                />
                <span
                  className={`py-2 px-4 border border-2 border-secondary-red rounded-r-lg ${
                    audio === "off"
                      ? "bg-secondary-red text-white"
                      : "text-primary-grey"
                  }`}
                >
                  Off
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashcardFormat;
