import { Home, Settings, LogOut, User } from "lucide-react"
import { SidebarItemList } from "../SidebarItemList/SidebarItemList";

import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuButton,
	SidebarFooter,
	SidebarHeader
} from "@/components/ui/sidebar"
import { Link } from "react-router";

const items = [
	{
		title: 'Home',
		url: 'home',
		icon: Home
	}
]

const subItems = [
	{
		title: 'Home',
		url: 'home',
	},
	{
		title: 'Settings',
		url: 'settings',
	}
]

export const AppSidebar = () => {
	return (
		<>
			<Sidebar>
				<SidebarHeader>
					<SidebarMenuButton asChild>
						<a href="" className="cursor-pointer flex justify-between">
							<div className="flex items-center gap-2">
								<User width={20} />
								<span className="font-medium">
									Alex Mason
								</span>
							</div>
						</a>
					</SidebarMenuButton>
				</SidebarHeader>
				<SidebarContent>
					<SidebarGroup>
						<SidebarMenu className="gap-0">
							{
								items.map(item => (
									<SidebarMenuItem key={item.title}>
										<SidebarMenuButton asChild>
											<a href="" className="cursor-pointer flex justify-between">
												<div className="flex items-center gap-2">
													<item.icon width={20} />
													<span className="font-medium">
														{item.title}
													</span>
												</div>
											</a>
										</SidebarMenuButton>
									</SidebarMenuItem>
								))
							}
						</SidebarMenu>
						<SidebarItemList title="Workspaces" items={subItems}
							createElement={{
								createTitle: 'Create Workspace', createAction: () => console.log("Created workspace")
							}}
						/>
					</SidebarGroup>
				</SidebarContent>
				<SidebarFooter>
					<SidebarMenuButton asChild>
						<Link to={'/settings'} className="cursor-pointer flex justify-between">
							<div className="flex items-center gap-2">
								<Settings width={20} />
								<span className="text-sm font-medium">
									Settings
								</span>
							</div>
						</Link>
					</SidebarMenuButton>
					<SidebarMenuButton asChild>
						<button className="cursor-pointer flex justify-between">
							<div className="flex items-center gap-2">
								<LogOut width={20} />
								<span className="text-sm font-medium">
									Log out
								</span>
							</div>
						</button>
					</SidebarMenuButton>
				</SidebarFooter>
			</Sidebar>
		</>
	);
};