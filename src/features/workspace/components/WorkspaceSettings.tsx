import clsx from "clsx";
import { useRef, useState } from "react";
import { Pencil, Check } from "lucide-react";
import { Input } from "@/shared/ui/shadcn/input";
import { Label } from "@/shared/ui/shadcn/label";
import { Checkbox } from "@/shared/ui/shadcn/checkbox";
import { Button } from "@/shared/ui/shadcn/button";
import type { TWorkspaceIcon } from "../types/workspace-icon";
import { WORKSPACE_ICON_MAP } from "../constants/workspace-icon-map";

import { useUpdateWorkspaceMutation } from "@/features/workspace/api/workspaceApi";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface IProps {
   workspaceId: string;
   workspaceName: string;
   isArchived: boolean;
   icon: TWorkspaceIcon | null;
   close: () => void;
}

export const WorkspaceSettingsModal = ({ workspaceId, workspaceName, isArchived, icon, close }: IProps) => {
   const { t } = useTranslation();
   const [updateWorkspace] = useUpdateWorkspaceMutation();
   const [editTitle, setEditTitle] = useState(false);
   const [title, setTitle] = useState(workspaceName);
   const [archived, setArchived] = useState(isArchived);
   const [selectedIcon, setSelectedIcon] = useState<TWorkspaceIcon>(icon ?? "home");

   const initialState = useRef({
      title: workspaceName,
      archived: isArchived,
      icon: icon ?? "home" as TWorkspaceIcon,
   });

   const isDirty =
      title !== initialState.current.title ||
      archived !== initialState.current.archived ||
      selectedIcon !== initialState.current.icon;

   const handleSave = async () => {
      const payload = {
         title,
         archived,
         icon: selectedIcon
      };

      try {
         await updateWorkspace({
            id: workspaceId,
            title: payload.title,
            icon: payload.icon,
            isArchived: payload.archived
         }).unwrap();
      } catch (error) {
         toast.error(t("workspace.updateError"));
         close();
         return;
      }

      toast.success(t("workspace.updateSuccess"));
      close()
   };

   return (
      <div className="flex flex-col gap-6">
         <div>
            <Label className="mb-1 text-base">{t("workspace.nameLabel")}</Label>
            <div className="relative">
               <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={!editTitle}
                  tabIndex={editTitle ? 0 : -1}
                  onBlur={() => setEditTitle(false)}
               />

               <button
                  type="button"
                  onClick={() => setEditTitle(prev => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
               >
                  {editTitle ? <Check size={16} /> : <Pencil size={16} />}
               </button>
            </div>
         </div>
         <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
               <Checkbox
                  checked={archived}
                  onCheckedChange={(v) => setArchived(Boolean(v))}
               />
               <Label className="text-base">{t("workspace.archiveLabel")}</Label>
            </div>
         </div>
         <div>
            <Label className="mb-2 block">{t("workspace.iconLabel")}</Label>
            <div className="grid grid-cols-5 gap-3">
               {Object.entries(WORKSPACE_ICON_MAP).map(([id, Icon]) => (
                  <button
                     key={id}
                     onClick={() => setSelectedIcon(id as TWorkspaceIcon)}
                     className={clsx(
                        "p-3 rounded-xl border transition",
                        selectedIcon === id
                           ? "border-primary bg-primary/10"
                           : "border-border hover:bg-muted"
                     )}
                  >
                     <Icon size={20} className="mx-auto" />
                  </button>
               ))}
            </div>
         </div>
         <div className="flex justify-end">
            <div>
               <Button variant="outline" className="mr-3" onClick={() => close()}>
                  {t("common.cancel")}
               </Button>
               <Button disabled={!isDirty} onClick={handleSave} className="self-start">
                  {t("common.save")}
               </Button>
            </div>
         </div>
      </div>
   );
};
