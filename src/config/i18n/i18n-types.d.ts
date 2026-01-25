import "i18next";
import ru from "./locales/ru/translation.json";

declare module "i18next" {
   interface CustomTypeOptions {
      defaultNS: "translation";
      resources: {
         translation: typeof ru;
      };
   }
}
