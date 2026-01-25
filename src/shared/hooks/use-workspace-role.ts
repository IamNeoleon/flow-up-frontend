import { useGetWorkspaceMembersQuery, useGetWorkspaceQuery } from "@/features/workspace/api/workspaceApi";

export const useWorkspaceRole = (workspaceId: string, userId: string | undefined) => {
	const { data: workspace } = useGetWorkspaceQuery(workspaceId)
	const isOwner = workspace?.ownerId === userId

	const { data: members } = useGetWorkspaceMembersQuery(workspaceId, {
		skip: isOwner
	})

	if (isOwner) return 'OWNER'

	const userRole = members?.find(m => m.userId === userId)?.role

	if (userRole) {
		return userRole
	}
}

