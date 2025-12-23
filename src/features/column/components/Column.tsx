import type { IColumn } from "@/shared/types/column.types";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import clsx from "clsx";

interface IColumnProps {
   column: IColumn;
   children?: React.ReactNode;
}

export const Column = ({ column, children }: IColumnProps) => {
   const { setNodeRef: setDroppableRef } = useDroppable({
      id: column.id,
      data: {
         type: 'column',
         columnId: column.id,
      }
   });

   const { setNodeRef: setDraggableRef, listeners, attributes, transform, isDragging } = useDraggable({
      id: column.id,
      data: {
         type: 'column',
         columnId: column.id
      }
   })

   const style = {
      transform: transform
         ? `translate3d(${transform.x}px, ${transform.y}px, 0) `
         : undefined,
   };

   const setNodeRef = (node: HTMLElement | null) => {
      setDroppableRef(node);
      setDraggableRef(node);
   };

   return (
      <>
         <div ref={setNodeRef} style={style} {...listeners} {...attributes}
            className={clsx('w-[300px] p-5 rounded-lg bg-[#171717]', isDragging && 'opacity-70')}>
            <h2 className="text-lg cursor-grab font-semibold mb-2 border-b pb-2 border-gray-700">{column.name} order: {column.order}</h2>
            {children}
         </div >
      </>
   );
};
