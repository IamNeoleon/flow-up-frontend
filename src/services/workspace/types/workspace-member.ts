import type { IUser } from "@/services/user/types/user";
import type { TWorkspaceRole } from "./workspace-role";

export interface IWorkspaceMember {
   id: string,
   role: TWorkspaceRole,
   userId: string,
   workspaceId: string,
   user: IUser
}