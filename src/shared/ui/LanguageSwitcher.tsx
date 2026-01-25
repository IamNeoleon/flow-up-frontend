import i18n from "i18next";
import { LANGUAGES, type LanguageCode } from "@/shared/config/languages";

export const LanguageSwitcher = () => {
   const current = i18n.language.split("-")[0] as LanguageCode;

   const changeLanguage = (lang: LanguageCode) => {
      i18n.changeLanguage(lang);
   };

   return (
      <div className="flex gap-2">
         {LANGUAGES.map(({ code, label }) => {
            const isActive = current === code;

            return (
               <button
                  key={code}
                  onClick={() => changeLanguage(code)}
                  className={`
              px-2 py-1 rounded text-sm
              ${isActive ? "bg-blue-600 text-white" : "bg-gray-200"}
            `}
               >
                  {label}
               </button>
            );
         })}
      </div>
   );
};
