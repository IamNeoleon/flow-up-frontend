import { Building2, ChevronDown, Plus } from "lucide-react"
import { Link } from "react-router"
import { CollapsibleContent, CollapsibleTrigger, Collapsible } from "../ui/collapsible"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubItem } from "../ui/sidebar"

interface ISidebarItemListProps {
	title: string,
	items: { title: string, url: string }[],
	createElement?: {
		createTitle: string,
		createAction: () => void
	}
}

export const SidebarItemList = ({ title, items, createElement }: ISidebarItemListProps) => {

	return (
		<SidebarMenu>
			<Collapsible>
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
								<SidebarMenuSubItem key={item.title}>
									<SidebarMenuButton asChild>
										<Link className="font-medium" to={item.url}>
											{item.title}
										</Link>
									</SidebarMenuButton >
								</SidebarMenuSubItem>
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