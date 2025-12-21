import { useCreateWorkspaceMutation } from "@/api/endpoints/workspaceApi"
import type { ICreateWorkspaceBody } from "@/shared/types/workspace.types"

export const useCreateWorkspace = () => {
	const [create, { isLoading, isError }] = useCreateWorkspaceMutation()

	const handleCreate = (data: ICreateWorkspaceBody) => {
		create(data)
	}

	return {
		handleCreate,
		isLoading,
		isError
	}
}