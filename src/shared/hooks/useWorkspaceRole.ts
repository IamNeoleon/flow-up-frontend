import type { IWorkspace } from "../types/workspace.types";

export const useWorkspaceRole = (workspace: IWorkspace, userId: string) => {
	const isOwner = workspace.ownerId === userId

	return { isOwner }
}