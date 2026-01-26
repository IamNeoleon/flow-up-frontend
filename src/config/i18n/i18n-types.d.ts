import "i18next";
import ru from "./locales/ru/translation.json";

declare module "i18next" {
   interface CustomTypeOptions {
      defaultNS: "translation";
      resources: {
         translation: typeof ru;
      };
   }

   interface TFunction {
      // строгие ключи (с подсказками)
      <K extends keyof typeof ru>(
         key: K,
         options?: TOptions
      ): string;

      // 🔥 разрешаем любые строки
      (key: string, options?: TOptions): string;
   }
}

