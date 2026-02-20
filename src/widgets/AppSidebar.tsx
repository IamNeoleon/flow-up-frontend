import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router";
import { Home, Settings, LogOut, User, BellDot } from "lucide-react";

import { useModal } from "@/app/providers/ModalProvider";
import { useGetWorkspacesQuery } from "@/services/workspace/api/workspaceApi";
import { CreateWorkspace } from "@/services/workspace/components/CreateWorkspace";
import { UserProfile } from "@/services/user/components/UserProfile";
import { useGetAllNotificationsQuery } from "@/services/notifications/api/notification-api";
import { NotificationList } from "@/services/notifications/ui/NotificationList";
import { SettingsModal } from "./SettingsModal";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/redux";
import { selectUser, setUser } from "@/store/slices/userSlice";
import { logout } from "@/store/slices/authSlice";
import {
   Sidebar,
   SidebarContent,
   SidebarGroup,
   SidebarMenu,
   SidebarMenuItem,
   SidebarMenuButton,
   SidebarFooter,
   SidebarHeader,
} from "@/shared/ui/shadcn/sidebar";
import { WorkspaceList } from "@/services/workspace/components/WorkspaceList";
import { cn } from "@/shared/utils/cn";
import { useLogoutMutation } from "@/services/auth/api/authApi";

export const AppSidebar = () => {
   const { t } = useTranslation();

   const [logoutFromServer] = useLogoutMutation()

   const dispatch = useAppDispatch();
   const navigate = useNavigate();
   const { open, close } = useModal();

   const user = useAppSelector(selectUser);

   const {
      data: notifications,
      isLoading: isLoadingNotifications,
      isError: isErrorNotifications,
      refetch,
   } = useGetAllNotificationsQuery();

   const unreadNotications = useMemo(() => {
      if (!notifications) return [];
      return notifications.filter((item) => item.read !== true);
   }, [notifications]);

   const {
      data: workspaces,
      isLoading: isLoadingWorkspaces,
      isError: isErrorWorkspaces,
   } = useGetWorkspacesQuery();

   const [openNotifications, setOpenNotifications] = useState(false);

   const onCreateWorkspace = () => {
      open({
         title: t("workspace.create"),
         description: t("workspace.createDescription"),
         content: <CreateWorkspace close={close} />,
      });
   };

   const handleOpenProfile = () => {
      open({
         title: t("profile.title"),
         description: t("profile.description"),
         content: <UserProfile close={close} />,
      });
   };

   const handleOpenSettings = () => {
      open({
         title: t("sidebar.settings"),
         description: t("common.settingsDescription"),
         content: <SettingsModal close={close} />,
      });
   };

   const handleLogout = async () => {
      dispatch(setUser(null));
      dispatch(logout());

      try {
         await logoutFromServer().unwrap()
      } catch (error) {
         console.error(error)
      }

      navigate("/auth", { replace: true });
   };

   return (
      <Sidebar collapsible="icon" className="z-1000 shrink-0">
         <SidebarHeader>
            <SidebarMenuButton asChild>
               <button type="button" onClick={handleOpenProfile}>
                  <User className="size-5 shrink-0" />
                  <span className="font-medium">{user?.fullName}</span>
               </button>
            </SidebarMenuButton>
         </SidebarHeader>

         <SidebarContent>
            <SidebarGroup>
               <SidebarMenu className="gap-0">
                  <SidebarMenuItem>
                     <SidebarMenuButton asChild>
                        <Link to="/">
                           <Home className="size-5 shrink-0" />
                           <span className="font-medium">
                              {t("sidebar.home")}
                           </span>
                        </Link>
                     </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                     <SidebarMenuButton asChild>
                        <button
                           type="button"
                           onClick={() => setOpenNotifications((prev) => !prev)}
                           className={cn(
                              openNotifications && "bg-accent text-primary",
                           )}
                        >
                           <BellDot className="size-5 shrink-0" />
                           <span className="font-medium">
                              {t("notifications.title")}
                           </span>

                           {unreadNotications.length > 0 ? (
                              <span className="ml-auto bg-primary text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium group-data-[collapsible=icon]:hidden">
                                 {unreadNotications.length}
                              </span>
                           ) : null}
                        </button>
                     </SidebarMenuButton>
                  </SidebarMenuItem>
               </SidebarMenu>

               <WorkspaceList
                  title={t("sidebar.workspaces")}
                  items={workspaces}
                  isLoading={isLoadingWorkspaces}
                  isError={isErrorWorkspaces}
                  createElement={{
                     createTitle: t("workspace.create"),
                     createAction: onCreateWorkspace,
                  }}
               />
            </SidebarGroup>
         </SidebarContent>

         <SidebarFooter>
            <SidebarMenuButton asChild>
               <button type="button" onClick={handleOpenSettings}>
                  <Settings className="size-5 shrink-0" />
                  <span className="text-sm font-medium">
                     {t("sidebar.settings")}
                  </span>
               </button>
            </SidebarMenuButton>

            <SidebarMenuButton asChild>
               <button type="button" onClick={handleLogout}>
                  <LogOut className="size-5 shrink-0" />
                  <span className="text-sm font-medium">
                     {t("sidebar.logout")}
                  </span>
               </button>
            </SidebarMenuButton>
         </SidebarFooter>

         <NotificationList
            open={openNotifications}
            isLoading={isLoadingNotifications}
            isError={isErrorNotifications}
            notifications={notifications}
            refetch={refetch}
            close={() => setOpenNotifications(false)}
         />
      </Sidebar>
   );
};
