import { AnimatePresence, motion } from "motion/react";
import { Laptop, Moon, Sun, Languages } from "lucide-react";
import { Button } from "@/shared/ui/shadcn/button";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/shared/ui/shadcn/dropdown-menu";
import { Separator } from "@/shared/ui/shadcn/separator";
import { useTheme } from "@/shared/lib/theme-context";
import { LANGUAGES, type LanguageCode } from "@/shared/config/languages";
import type { ThemeMode } from "@/shared/lib/theme";
import { useTranslation } from "react-i18next";

const THEME_ICONS: Record<ThemeMode, typeof Sun> = {
   light: Sun,
   dark: Moon,
   system: Laptop,
};

const THEME_CYCLE: ThemeMode[] = ["light", "dark", "system"];

const ThemeToggle = () => {
   const { theme, setTheme } = useTheme();
   const CurrentIcon = THEME_ICONS[theme] ?? Sun;

   const handleToggle = () => {
      const idx = THEME_CYCLE.indexOf(theme);
      const next = THEME_CYCLE[(idx + 1) % THEME_CYCLE.length];
      setTheme(next);
   };

   return (
      <Button
         variant="ghost"
         size="icon"
         onClick={handleToggle}
         className="h-8 w-8 rounded-full"
         aria-label="Toggle theme"
      >
         <AnimatePresence mode="wait" initial={false}>
            <motion.span
               key={theme}
               initial={{ opacity: 0, rotate: -40, scale: 0.5 }}
               animate={{ opacity: 1, rotate: 0, scale: 1 }}
               exit={{ opacity: 0, rotate: 40, scale: 0.5 }}
               transition={{ duration: 0.18 }}
               className="flex items-center justify-center"
            >
               <CurrentIcon size={15} />
            </motion.span>
         </AnimatePresence>
      </Button>
   );
}


const LanguageSelector = () => {
   const { i18n } = useTranslation();
   const current = i18n.language.split("-")[0] as LanguageCode;

   return (
      <DropdownMenu>
         <DropdownMenuTrigger asChild>
            <Button
               variant="ghost"
               size="sm"
               className="h-8 gap-1.5 rounded-full px-2.5 font-mono text-[11px] tracking-widest uppercase"
            >
               <Languages size={13} className="opacity-60" />
               {current}
            </Button>
         </DropdownMenuTrigger>

         <DropdownMenuContent
            align="end"
            side="top"
            sideOffset={8}
            className="w-auto rounded-xl p-1"
         >
            {LANGUAGES.map(({ code, label }) => (
               <DropdownMenuItem
                  key={code}
                  onClick={() => i18n.changeLanguage(code)}
                  className="flex items-center gap-1 rounded-lg px-3 py-1.5 cursor-pointer"
               >
                  <span className="font-mono text-xs font-medium tracking-widest uppercase">
                     {code}
                  </span>
                  <span className="text-muted-foreground text-[12px] flex-1 text-right">
                     {label}
                  </span>
               </DropdownMenuItem>
            ))}
         </DropdownMenuContent>
      </DropdownMenu>
   );
}


export const PageControls = () => {
   return (
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-1 rounded-full border border-border/50 bg-background/70 px-2 py-1.5 shadow-lg backdrop-blur-xl">
         <ThemeToggle />
         <Separator orientation="vertical" className="h-4" />
         <LanguageSelector />
      </div>
   );
};