export const LANGUAGES = [
   { code: "ru", label: "Русский" },
   { code: "en", label: "English" }
] as const;

export type LanguageCode = typeof LANGUAGES[number]["code"];