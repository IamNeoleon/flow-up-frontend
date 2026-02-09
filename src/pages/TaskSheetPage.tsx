import { TaskDetails } from "@/services/tasks/components/TaskDetails";
import { Sheet, SheetContent, SheetTitle } from "@/shared/ui/shadcn/sheet";
import { useNavigate, useParams } from "react-router";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useEffect, useRef, useState } from "react";
import { routes } from "@/shared/routes";

const CLOSE_MS = 250;

const TaskSheetPage = () => {
   const { workspaceId, boardId, colId, taskId } = useParams();
   const [open, setOpen] = useState(false);
   const navigate = useNavigate();
   const closingRef = useRef(false);

   const onOpenChange = (v: boolean) => {
      if (v) {
         setOpen(true);
         return;
      }

      if (closingRef.current) return;
      closingRef.current = true;

      setOpen(false);

      window.setTimeout(() => {
         if (workspaceId && boardId) {
            navigate(routes.board({ workspaceId, boardId }));
         } else {
            navigate(-1)
         }
      }, CLOSE_MS);
   }

   useEffect(() => {
      const id = requestAnimationFrame(() => setOpen(true));
      return () => cancelAnimationFrame(id);
   }, []);

   if (!colId || !taskId) return null;

   return (
      <Sheet
         open={open}
         onOpenChange={onOpenChange}
      >
         <SheetContent className="overflow-y-auto" style={{ width: "45%", maxWidth: '100%' }}>
            <SheetTitle>
               <VisuallyHidden>Edit</VisuallyHidden>
            </SheetTitle>
            <TaskDetails close={() => onOpenChange(false)} colId={colId} taskId={taskId} />
         </SheetContent>
      </Sheet>
   );
};

export default TaskSheetPage