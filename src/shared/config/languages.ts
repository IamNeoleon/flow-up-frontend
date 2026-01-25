export const LANGUAGES = [
   { code: "ru", label: "RU" },
   { code: "en", label: "EN" }
] as const;

export type LanguageCode = typeof LANGUAGES[number]["code"];