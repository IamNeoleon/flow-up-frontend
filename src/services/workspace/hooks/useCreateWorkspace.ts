import { useCreateWorkspaceMutation } from "@/services/workspace/api/workspaceApi"

export const useCreateWorkspace = () => {

	const handleCreate = (data: { name: string }) => {
		create(data)
	}

	return {
		handleCreate,
		isLoading,
		isError
	}
}