import type { IWorkspace } from "@/features/workspace/types/workspace"
import { useGetIcon } from "../hooks/use-get-icon"
import { SidebarMenuButton, SidebarMenuSubItem } from "./shadcn/sidebar"
import { Link } from "react-router"
import { cn } from "../utils/cn"

interface WorkspaceItemProps {
   item: IWorkspace
   mainUrl: string
   isActive: boolean
}

export const WorkspaceItem = ({ item, mainUrl, isActive }: WorkspaceItemProps) => {
   const Icon = useGetIcon(item.icon)

   return (
      <SidebarMenuSubItem>
         <SidebarMenuButton asChild>
            <Link
               to={`${mainUrl}/${item.id}`}
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
