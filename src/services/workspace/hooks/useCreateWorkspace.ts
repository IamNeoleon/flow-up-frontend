import { useCreateWorkspaceMutation } from "@/services/workspace/api/workspaceApi"

export const useCreateWorkspace = () => {
	const [create, { isLoading, isError }] = useCreateWorkspaceMutation()

	const handleCreate = (data: { name: string }) => {
		create(data)
	}

	return {
		handleCreate,
		isLoading,
		isError
	}
}