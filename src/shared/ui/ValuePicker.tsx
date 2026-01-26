import { type ReactNode } from "react";
import { useTranslation } from "react-i18next";

interface IValuePickerProps {
   children?: ReactNode,
}

export const ValuePicker = ({ children }: IValuePickerProps) => {
   const { t } = useTranslation()

   return (
      <>
         <div className="rounded inline-block py-1 px-2  cursor-pointer hover:bg-[#272727]">
            {children ? (
               children
            ) : (
               <span className="text-[#605e5b] font-medium">{t("common.notSet")}</span>
            )}
         </div>
      </>
   );
};
