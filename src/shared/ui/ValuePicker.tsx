import { type ReactNode } from "react";

interface IValuePickerProps {
   children?: ReactNode,
}

export const ValuePicker = ({ children }: IValuePickerProps) => {
   return (
      <>
         <div className="rounded inline-block py-1 px-2  cursor-pointer hover:bg-[#272727]">
            {children ? (
               children
            ) : (
               <span className="text-[#605e5b] font-medium">Не задано</span>
            )}
         </div>
      </>
   );
};
