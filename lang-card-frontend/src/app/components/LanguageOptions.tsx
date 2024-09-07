import React from "react";
import {
  LanguageLevels,
  LanguageLevelsType,
} from "../constants/LANGUAGE_LEVELS";
import {
  SupportedLanguages,
  SupportedLanguagesType,
  LanguageNameMap,
} from "../constants/SUPPORTED_LANGUAGES";

const LanguageOptions = ({
  learningLanguage,
  languageLevel,
  setLearningLanguage,
  setLanguageLevel,
}: {
  learningLanguage?: SupportedLanguagesType;
  languageLevel?: LanguageLevelsType;
  setLearningLanguage: (language: SupportedLanguagesType | undefined) => void;
  setLanguageLevel: (level: LanguageLevelsType | undefined) => void;
}) => {
  return (
    <div className="flex flex-col gap-5 items-center justify-center w-full">
      <h2 className="text-xl text-center font-semibold text-primary-gray">
        Language Options
      </h2>
      <LanguageSelector
        id="learningLanguage"
        label="What language are you learning?"
        value={learningLanguage}
        onChange={(e) =>
          setLearningLanguage(e.target.value as SupportedLanguagesType)
        }
        options={SupportedLanguages}
      />
      {/* <LanguageSelector
        id="languageLevel"
        label="What level are you?"
        value={languageLevel}
        onChange={(e) => setLanguageLevel(e.target.value as LanguageLevelsType)}
        options={LanguageLevels}
      /> */}
    </div>
  );
};

const LanguageSelector = ({
  id,
  label,
  value,
  onChange,
  options,
}: {
  id: string;
  label: string;
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: readonly string[];
}) => (
  <div className="flex gap-5 justify-center items-center">
    <label
      className="text-lg text-primary-grey w-full text-center"
      htmlFor={id}
    >
      {label}
    </label>
    <select
      id={id}
      value={value}
      onChange={onChange}
      className="block appearance-none min-w-[200px] border border-secondary-grey hover:border-primary-grey px-4 py-2 pr-8 rounded leading-tight focus:outline-none"
    >
      <option value="">
        Select {id === "learningLanguage" ? "Language" : "Level"}
      </option>
      {options.map((option) => (
        <option key={option} value={option}>
          {id === "learningLanguage"
            ? LanguageNameMap[option as SupportedLanguagesType]
            : option}
        </option>
      ))}
    </select>
  </div>
);

export default LanguageOptions;
