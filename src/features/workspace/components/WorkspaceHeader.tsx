import { Button } from "@/shared/ui/shadcn/button";
import { House, Settings, Plus } from "lucide-react";


interface IWorkspaceHeaderProps {
   workspaceName: string;
   workspaceDescription?: string;
   workspaceId: string;
   isOwner: boolean;
}

export const WorkspaceHeader = ({ workspaceName, workspaceId, isOwner }: IWorkspaceHeaderProps) => {
   return (
      <>
         <div className='mb-4 w-full pb-2 border-b'>
            <div className="flex justify-between items-center mb-3">
               <div>
                  <div className="flex items-center gap-3 mb-3">
                     <House />
                     <h1 className='text-3xl capitalize'>
                        {workspaceName}
                     </h1>
                  </div>
                  <div className="flex items-center gap-2">
                     <span className="text-lg font-medium">Статус:</span>
                     <div className="bg-emerald-300 px-2 rounded-md">
                        <span className="text-emerald-900 font-bold">Активен</span>
                     </div>
                  </div>
               </div>
               <div className="flex gap-3">
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                     <Settings />
                     Настройки
                  </Button>
                  <Button variant="default" size="sm" className="flex items-center gap-2 ">
                     <Plus />
                     Создать новую доску
                  </Button>
               </div>
            </div>

         </div>
      </>
   );
};
