import { useState, type FC, type FormEvent } from "react";
import { Input } from "@/shared/ui/shadcn/input";
import { Button } from "@/shared/ui/shadcn/button";
import { useCreateBoardMutation } from "@/services/board/api/boardApi";
import { Spinner } from "@/shared/ui/shadcn/spinner";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export const CreateBoard: FC<{ close: () => void; workspaceId: string }> = ({
   close,
   workspaceId,
}) => {
   const { t } = useTranslation();
   const [create, { isLoading }] = useCreateBoardMutation();
   const [boardData, setBoardData] = useState<{
      name: string;
      description: string;
   }>({
      name: "",
      description: "",
   });

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;

      setBoardData((prev) => ({
         ...prev,
         [name]: value,
      }));
   };

   const handleSubmit = async (e: FormEvent) => {
      e.preventDefault();

      try {
         await create({ workspaceId, ...boardData }).unwrap();
         toast.success(t("board.createSuccess"));
         close();
      } catch {
         toast.error(t("board.createError"));
      }
   };

   return (
      <>
         <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <Input
               name="name"
               onChange={handleChange}
               required
               value={boardData?.name}
               placeholder={t("board.namePlaceholder")}
            />
            <Input
               name="description"
               onChange={handleChange}
               required
               value={boardData?.description}
               placeholder={t("board.descriptionPlaceholder")}
            />
            <Button className="w-full" type="submit">
               {isLoading ? <Spinner /> : t("common.create")}
            </Button>
         </form>
      </>
   );
};
