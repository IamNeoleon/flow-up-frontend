import type { IColumn } from "@/shared/types/column.types";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { GripVertical } from "lucide-react";
import clsx from "clsx";
import { EditColumn } from "./EditColumn";
import { useAppSelector } from "@/shared/hooks/redux";
import { selectPermissions } from "@/store/slices/boardSlice";
import { DeleteColumn } from "./DeleteColumn";

interface IColumnProps {
   column: IColumn;
   children?: React.ReactNode;
}

export const Column = ({ column, children }: IColumnProps) => {
   const columnApiColor = column.color ? column.color : '#3c3c3c';
   const permissions = useAppSelector(selectPermissions)

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
         <div ref={setNodeRef} style={style}
            className={clsx(`w-[300px] p-5 relative`, isDragging && 'opacity-90 z-20')}>
            <div className={`absolute inset-0 rounded-lg brightness-[0.3]`} style={{ backgroundColor: columnApiColor }} />
            <div className="relative z-10">
               <div className="group flex items-center justify-between w-full border-b mb-2 pb-1" style={{ borderColor: columnApiColor }}>
                  <h2 className="text-lg font-semibold">{column.name}</h2>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                     {
                        permissions?.canEditBoard && (
                           <EditColumn status={column.status} color={columnApiColor} colId={column.id} boardId={column.boardId} title={column.name} />
                        )
                     }
                     {
                        permissions?.canDeleteColumn && (
                           <DeleteColumn boardId={column.boardId} colId={column.id} />
                        )
                     }
                     {
                        permissions?.canMoveColumn && (
                           <div {...listeners} {...attributes} className="cursor-grab">
                              <GripVertical size={20} />
                           </div>
                        )
                     }
                  </div>
               </div>
               {children}
            </div>
         </div >
      </>
   );
};
