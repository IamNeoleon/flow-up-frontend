import { Home, Settings, LogOut, User } from "lucide-react"
import { Link } from "react-router";
import { useModal } from "@/app/providers/ModalProvider";
import { useGetWorkspacesQuery } from "@/api/endpoints/workspaceApi";
import { CreateWorkspace } from "@/features/workspace/components/CreateWorkspace";
import { SidebarItemList } from "@/components/SidebarItemList/SidebarItemList";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuButton,
	SidebarFooter,
	SidebarHeader
} from "@/shared/ui/sidebar"
import { useEffect, useState } from "react";
import { useAppSelector } from "@/shared/hooks/redux";
import { selectUser, setUser } from "@/store/slices/userSlice";

const items = [
	{
		title: 'Home',
		url: 'home',
		icon: Home
	}
]

export const AppSidebar = () => {
	const user = useAppSelector(selectUser)
	const { data } = useGetWorkspacesQuery()
	const { open, close } = useModal()
	const [workspaceItems, setWorkspaceItems] = useState<{ title: string, url: string }[]>([])

	const onOpenModal = () => {
		open({
			title: 'Create a new workspace',
			description: "Create workspace, create, create",
			content: <CreateWorkspace close={close} />
		})
	}

	const logout = () => {
		setUser(null)
		localStorage.removeItem('accessToken')
		window.location.reload()
	}

	useEffect(() => {
		if (data) {
			setWorkspaceItems(() => data.map(item => ({ title: item.name, url: item.id })))
		}
	}, [data])


	return (
		<>

			<Sidebar>
				<SidebarHeader>
					<SidebarMenuButton asChild>
						<a href="" className="cursor-pointer flex justify-between">
							<div className="flex items-center gap-2">
								<User width={20} />
								<span className="font-medium">
									{user?.username}
								</span>
							</div>
						</a>
					</SidebarMenuButton>
				</SidebarHeader>
				<SidebarContent>
					<SidebarGroup>
						<SidebarMenu className="gap-0">
							{
								items.map((item) => (
									<SidebarMenuItem key={item.title}>
										<SidebarMenuButton asChild>
											<Link to={item.url} className="cursor-pointer flex justify-between">
												<div className="flex items-center gap-2">
													<item.icon width={20} />
													<span className="font-medium">
														{item.title}
													</span>
												</div>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								))
							}
						</SidebarMenu>
						<SidebarItemList
							title="Workspaces"
							mainUrl="/workspaces"
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
						<button onClick={logout} className="cursor-pointer flex justify-between">
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