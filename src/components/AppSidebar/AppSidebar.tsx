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
import { useGetWorkspacesQuery } from "@/features/Workspace/api/workspaceApi";
import { useModal } from "@/app/providers/ModalProvider";
import { CreateWorkspace } from "@/features/Workspace/CreateWorkspace";

const items = [
	{
		title: 'Home',
		url: 'home',
		icon: Home
	}
]

export const AppSidebar = () => {
	const { data, isLoading, isError } = useGetWorkspacesQuery()
	const { open } = useModal()

	const onOpenModal = () => {
		open({
			title: "Create a new workspace",
			description: "Create workspace, create, create",
			size: "md",
			content: <CreateWorkspace />,
		})
	}
	let workspaceItems: { title: string, url: string }[] = []
	if (data) {
		data.forEach(item => {
			workspaceItems.push(
				{
					title: item.name,
					url: item.id
				}
			)
		})
	}

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
						<SidebarItemList
							title="Workspaces"
							items={workspaceItems}
							createElement={{
								createTitle: 'Create Workspace', createAction: onOpenModal
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