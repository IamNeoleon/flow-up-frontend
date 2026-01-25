import { Home, Settings, LogOut, User } from "lucide-react"
import { Link, useNavigate } from "react-router";
import { useModal } from "@/app/providers/ModalProvider";
import { useGetWorkspacesQuery } from "@/features/workspace/api/workspaceApi";
import { CreateWorkspace } from "@/features/workspace/components/CreateWorkspace";
import { SidebarItemList } from "@/shared/ui/SidebarItemList";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuButton,
	SidebarFooter,
	SidebarHeader
} from "@/shared/ui/shadcn/sidebar"
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/redux";
import { selectUser, setUser } from "@/store/slices/userSlice";
import { logout } from "@/store/slices/authSlice";
import { UserProfile } from "@/features/user/components/UserProfile";

const items = [
	{
		title: 'Home',
		url: '/',
		icon: Home
	}
]

export const AppSidebar = () => {
	const user = useAppSelector(selectUser)
	const { data } = useGetWorkspacesQuery()
	const { open, close } = useModal()
	const [workspaceItems, setWorkspaceItems] = useState<{ title: string, url: string }[]>([])
	const dispatch = useAppDispatch()
	const navigate = useNavigate()

	const onCreateWorkspace = () => {
		open({
			title: 'Создание воркспейса',
			description: "Введите название, а все остальное вы сможете отредактировать на самой странице воркспейса.",
			content: <CreateWorkspace close={close} />
		})
	}

	const handleOpenProfile = () => {
		open({
			title: 'Мой профиль',
			description: "Здесь вы можете редактировать настройки профиля, а также личную информацию о себе.",
			content: <UserProfile close={close} />
		})
	}

	const handleLogout = () => {
		dispatch(setUser(null))
		dispatch(logout())
		navigate('/auth', { replace: true })
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
						<button onClick={handleOpenProfile} className="cursor-pointer flex items-center gap-2">
							<User width={20} />
							<span className="font-medium">
								{user?.username}
							</span>
						</button>
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
								createTitle: 'Create Workspace', createAction: onCreateWorkspace
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
						<button onClick={handleLogout} className="cursor-pointer flex justify-between">
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