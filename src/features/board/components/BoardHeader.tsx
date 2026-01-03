import { useState } from "react";
import ContentEditable from "react-contenteditable";
import { useEditBoardMutation } from "@/api/endpoints/boardApi";
import { toast } from "sonner";

interface IBoardHeaderProps {
   workspaceId: string;
   boardId: string;
   boardTitle: string;
   boardDescription: string;
}

export const BoardHeader = ({ workspaceId, boardId, boardTitle, boardDescription }: IBoardHeaderProps) => {
   const [editBoard] = useEditBoardMutation();
   const [title, setTitle] = useState(boardTitle);
   const [description, setDescription] = useState(boardDescription);

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

   return (
      <div className="p-4">
         <ContentEditable
            html={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={(e: React.FocusEvent<HTMLDivElement>) => handleSave("title", e)}
            className="hover:cursor-pointer text-4xl font-bold mb-2 border-b border-transparent focus:border-blue-500 outline-none cursor-text"
         />
         <ContentEditable
            html={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={(e: React.FocusEvent<HTMLDivElement>) => handleSave("description", e)}
            className="hover:cursor-pointer text-lg border-b border-transparent focus:border-blue-500 outline-none cursor-text"
         />
      </div>
   );
};
