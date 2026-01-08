import { useState } from "react";
import ContentEditable from "react-contenteditable";
import { useEditBoardMutation } from "@/api/endpoints/boardApi";
import { toast } from "sonner";
import { useAppSelector } from "@/shared/hooks/redux";
import { selectPermissions } from "@/store/slices/boardSlice";
import { CreateColumn } from '@/features/column/components/CreateColumn'
import { useModal } from '@/app/providers/ModalProvider'
import {
   Breadcrumb,
   BreadcrumbItem,
   BreadcrumbLink,
   BreadcrumbList,
   BreadcrumbPage,
   BreadcrumbSeparator,
} from "@/shared/ui/shadcn/breadcrumb"
import { Button } from "@/shared/ui/shadcn/button";
import { Ellipsis, Users, Plus } from "lucide-react";
import { BoardMembers } from "./BoardMembers";
import type { IWorkspace } from "@/shared/types/workspace.types";
import { Link } from "react-router";

interface IBoardHeaderProps {
   workspaceId: string;
   boardId: string;
   boardTitle: string;
   boardDescription: string;
   currentWorkspace: IWorkspace | null
}

export const BoardHeader = ({ workspaceId, boardId, boardTitle, boardDescription, currentWorkspace }: IBoardHeaderProps) => {
   const [editBoard] = useEditBoardMutation();
   const [title, setTitle] = useState(boardTitle);
   const [description, setDescription] = useState(boardDescription);
   const permissions = useAppSelector(selectPermissions)
   const { open, close } = useModal()


   const handleSave = async (field: "title" | "description", e: React.FocusEvent<HTMLDivElement>) => {
      const value = e.currentTarget.textContent || "";

      try {
         if (field === "title" && value !== boardTitle) {
            await editBoard({ workspaceId, boardId, name: value, description: description }).unwrap();
         } else if (field === "description" && value !== boardDescription) {
            await editBoard({ workspaceId, boardId, name: title, description: value }).unwrap();
         }
      } catch (err) {
         toast.error("Ошибка при сохранении изменений");
         if (field === "title") setTitle(boardTitle);
         if (field === "description") setDescription(boardDescription);
      }
   };

   const handleCreateCol = () => {
      open({
         title: 'Создать колонку',
         description: 'Создание колонки',
         content: <CreateColumn boardId={boardId} close={close} />,
      })
   }

   const handleOpenMembers = () => {
      open({
         title: 'Участники доски',
         description: 'Здесь отображаются участники всего воркспейса. По умолчанию все участники (кроме владельца воркспейса и доски) имеют роль участников (read-only права).',
         content: <BoardMembers workspaceId={workspaceId} boardId={boardId} close={close} />,
      })
   }

   return (
      <>
         <div className="flex items-center justify-between mb-10">
            <div>
               <div className="mb-3">
                  <ContentEditable
                     html={title}
                     onChange={(e) => setTitle(e.target.value)}
                     onBlur={(e: React.FocusEvent<HTMLDivElement>) => handleSave("title", e)}
                     className="hover:cursor-pointer text-4xl font-semibold mb-2 border-b border-transparent focus:border-blue-500 outline-none cursor-text"
                  />
               </div>
               <Breadcrumb>
                  <BreadcrumbList>
                     <BreadcrumbItem>
                        <Link to={`/workspaces/${currentWorkspace?.id}`}>{currentWorkspace?.name}</Link>
                     </BreadcrumbItem>
                     <BreadcrumbSeparator />
                     <BreadcrumbItem>
                        <BreadcrumbPage>{boardTitle}</BreadcrumbPage>
                     </BreadcrumbItem>
                  </BreadcrumbList>
               </Breadcrumb>
            </div>
            <div className="flex flex-col gap-2 items-end">
               <div className="flex gap-2">
                  <Button onClick={handleOpenMembers} variant='outline'>
                     <Users />
                     <span>
                        Участники
                     </span>
                  </Button>
                  <Button variant='outline' >
                     <Ellipsis />
                  </Button>
               </div>
               {
                  permissions?.canCreateColumn && (
                     <Button onClick={handleCreateCol} className="flex items-center gap-1">
                        <Plus />
                        <span> Создать колонку</span>
                     </Button>
                  )
               }
            </div>
         </div >
      </>
   );
};
