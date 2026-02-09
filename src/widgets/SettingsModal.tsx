import i18n from "i18next";
import { useTranslation } from "react-i18next";
import { Laptop, Moon, Sun } from "lucide-react";
import { Label } from "@/shared/ui/shadcn/label";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/shared/ui/shadcn/select"
import { useTheme } from "@/shared/lib/theme-context";
import { LANGUAGES, type LanguageCode } from "@/shared/config/languages";
import { Button } from "@/shared/ui/shadcn/button";
import type { ThemeMode } from "@/shared/lib/theme";

const THEMES: Array<{ value: ThemeMode; icon: typeof Sun; labelKey: string }> = [
   { value: "light", icon: Sun, labelKey: "theme.light" },
   { value: "dark", icon: Moon, labelKey: "theme.dark" },
   { value: "system", icon: Laptop, labelKey: "theme.system" }
];

export const SettingsModal = ({ close }: { close: () => void }) => {
   const { t } = useTranslation()
   const { theme, setTheme } = useTheme();

   const current = i18n.language.split("-")[0] as LanguageCode;

   const changeLanguage = (lang: LanguageCode) => {
      i18n.changeLanguage(lang);
   };

   return (
      <>
         <div className="flex flex-col gap-3">
            <div>
               <Label className="mb-2">{t('theme.label')}</Label>
               <Select defaultValue={theme} onValueChange={(value) => setTheme(value as ThemeMode)}>
                  <SelectTrigger className="w-[180px]">
                     <SelectValue placeholder={t("theme.label")} />
                  </SelectTrigger>
                  <SelectContent>
                     {
                        THEMES.map(theme => (
                           <SelectItem key={theme.value} value={theme.value}>{t(theme.labelKey as any)}</SelectItem>
                        ))
                     }
                  </SelectContent>
               </Select>
            </div>
            <div>
               <Label className="mb-2">{t('language.language')}</Label>
               <Select defaultValue={current} onValueChange={(value) => changeLanguage(value as LanguageCode)}>
                  <SelectTrigger className="w-[180px]">
                     <SelectValue placeholder={t("language.language")} />
                  </SelectTrigger>
                  <SelectContent>
                     {LANGUAGES.map(item => (
                        <SelectItem key={item.code} value={item.code}>{item.label}</SelectItem>
                     ))}
                  </SelectContent>
               </Select>
            </div>
            <Button onClick={close}>{t("common.save")}</Button>
         </div>
      </>
   );
};
