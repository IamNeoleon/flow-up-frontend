import { Home, Settings, LogOut, User } from "lucide-react"
import { Link, useNavigate } from "react-router";
import { useModal } from "@/app/providers/ModalProvider";
import { useGetWorkspacesQuery } from "@/features/workspace/api/workspaceApi";
import { CreateWorkspace } from "@/features/workspace/components/CreateWorkspace";
import { WorkspaceList } from "@/shared/ui/WorkspaceList";
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
import { useTranslation } from "react-i18next";
import type { IWorkspace } from "@/features/workspace/types/workspace";
import { SettingsModal } from "./SettingsModal";

export const AppSidebar = () => {
	const { t } = useTranslation()
	const items = [
		{
			title: t("sidebar.home"),
			url: "/",
			icon: Home
		}
	]

	const user = useAppSelector(selectUser)
	const { data } = useGetWorkspacesQuery()
	const { open, close } = useModal()
	const [workspaceItems, setWorkspaceItems] = useState<IWorkspace[]>([])
	const dispatch = useAppDispatch()
	const navigate = useNavigate()

	const onCreateWorkspace = () => {
		open({
			title: t("workspace.create"),
			description: t("workspace.createDescription"),
			content: <CreateWorkspace close={close} />
		})
	}

	const handleOpenProfile = () => {
		open({
			title: t("profile.title"),
			description: t("profile.description"),
			content: <UserProfile close={close} />
		})
	}

	const handleOpenSettings = () => {
		open({
			title: t("sidebar.settings"),
			description: t("common.settingsDescription"),
			content: <SettingsModal close={close} />
		})
	}

	const handleLogout = () => {
		dispatch(setUser(null))
		dispatch(logout())
		navigate('/auth', { replace: true })
	}

	useEffect(() => {
		if (data) {
			setWorkspaceItems(data)
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
						<WorkspaceList
							title={t("sidebar.workspaces")}
							mainUrl="/workspaces"
							items={workspaceItems}
							createElement={{
								createTitle: t("workspace.create"), createAction: onCreateWorkspace
							}}
						/>
					</SidebarGroup>
				</SidebarContent>
				<SidebarFooter>
					<SidebarMenuButton asChild>
						<button onClick={handleOpenSettings} className="cursor-pointer flex justify-between">
							<div className="flex items-center gap-2">
								<Settings width={20} />
								<span className="text-sm font-medium">
									{t("sidebar.settings")}
								</span>
							</div>
						</button>
					</SidebarMenuButton>
					<SidebarMenuButton asChild>
						<button onClick={handleLogout} className="cursor-pointer flex justify-between">
							<div className="flex items-center gap-2">
								<LogOut width={20} />
								<span className="text-sm font-medium">
									{t("sidebar.logout")}
								</span>
							</div>
						</button>
					</SidebarMenuButton>
				</SidebarFooter>
			</Sidebar>
		</>
	);
};
