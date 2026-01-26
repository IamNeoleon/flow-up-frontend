import { Building2, ChevronDown, Plus } from "lucide-react"
import { CollapsibleContent, CollapsibleTrigger, Collapsible } from "./shadcn/collapsible"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubItem } from "./shadcn/sidebar"
import { useState } from "react"
import type { IWorkspace } from "@/features/workspace/types/workspace"
import { WorkspaceItem } from "./WorkspaceItem"
import { useParams } from "react-router"

interface IWorkspaceListProps {
	title: string,
	mainUrl: string,
	items: IWorkspace[],
	createElement?: {
		createTitle: string,
		createAction: () => void
	}
}

export const WorkspaceList = ({ title, items, createElement, mainUrl }: IWorkspaceListProps) => {
	const { workspaceId } = useParams()

	const [open, setOpen] = useState(true)

	return (
		<SidebarMenu>
			<Collapsible open={open} onOpenChange={setOpen}>
				<SidebarMenuItem>
					<CollapsibleTrigger asChild>
						<SidebarMenuButton asChild className="group">
							<div className="cursor-pointer flex justify-between">
								<div className="flex items-center gap-2">
									<Building2 width={20} />
									<span className="font-medium">
										{title}
									</span>
								</div>
								<ChevronDown className="transition-transform group-data-[state=open]:rotate-180" />
							</div>
						</SidebarMenuButton>
					</CollapsibleTrigger>
					<CollapsibleContent>
						<SidebarMenuSub>
							{items.map(item => (
								<WorkspaceItem
									key={item.id}
									item={item}
									mainUrl={mainUrl}
									isActive={item.id === workspaceId}
								/>
							))}
							{
								createElement && (
									<SidebarMenuSubItem>
										<SidebarMenuButton asChild>
											<button onClick={createElement.createAction}>
												<Plus size={20} />
												<span className="text-sm font-medium">{createElement.createTitle}</span>
											</button>
										</SidebarMenuButton >
									</SidebarMenuSubItem>
								)
							}
						</SidebarMenuSub>
					</CollapsibleContent>
				</SidebarMenuItem>
			</Collapsible>
		</SidebarMenu>
	)
}