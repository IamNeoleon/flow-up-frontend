import type { IColumn } from "@/shared/types/column.types";
import { useDroppable } from "@dnd-kit/core";

interface IColumnProps {
   column: IColumn;
   children?: React.ReactNode;
}

export const Column = ({ column, children }: IColumnProps) => {
   const { setNodeRef } = useDroppable({ id: column.id });

   return (
      <>
         <div ref={setNodeRef} className="w-[300px] p-5 rounded-lg bg-[#171717]">
            <h2 className="text-lg font-semibold mb-2 border-b pb-2 border-gray-700">{column.name}</h2>
            {children}
         </div >
      </>
   );
};
