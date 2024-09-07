export const SupportedLanguages = ["ja", "tl", "vi"] as const;
export type SupportedLanguagesType = (typeof SupportedLanguages)[number];

export const LanguageNameMap: Record<SupportedLanguagesType, string> = {
  ja: "Japanese",
  tl: "Tagalog",
  vi: "Vietnamese",
};
