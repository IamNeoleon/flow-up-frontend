import { Link } from "react-router"
import { useGetIcon } from "@/shared/hooks/use-get-icon"
import { SidebarMenuButton, SidebarMenuSubItem } from "@/shared/ui/shadcn/sidebar"
import { cn } from "@/shared/utils/cn"
import type { IWorkspace } from "@/services/workspace/types/workspace"

interface IProps {
   item: IWorkspace
   isActive: boolean
}

export const WorkspaceItem = ({ item, isActive }: IProps) => {
   const Icon = useGetIcon(item.icon)

   return (
      <SidebarMenuSubItem>
         <SidebarMenuButton asChild>
            <Link
               to={`workspaces/${item.id}`}
               className={cn(
                  "relative flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium transition-colors",
                  "hover:bg-accent/70 hover:text-primary",
                  isActive && "bg-accent text-primary"
               )}
            >
               {Icon && <Icon className="size-4 shrink-0" />}
               <span className="truncate">{item.name}</span>
            </Link>
         </SidebarMenuButton>
      </SidebarMenuSubItem>
   )
}
