import { useState, type FC } from "react"
import { toast } from "sonner"
import { Button } from "@/shared/ui/shadcn/button"
import { Input } from "@/shared/ui/shadcn/input"
import { Label } from "@/shared/ui/shadcn/label"
import { useCreateWorkspace } from "../hooks/useCreateWorkspace"

export const CreateWorkspace: FC<{ close: () => void }> = ({ close }) => {
	const { handleCreate } = useCreateWorkspace()
	const [workspaceName, setWorkspaceName] = useState<string>('')

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		handleCreate({ name: workspaceName })
		close()
		toast.success('Успешное создание!')
	}

	return (
		<form onSubmit={handleSubmit}>
			<div className="grid gap-4">
				<div className="grid gap-3">
					<Label htmlFor="name-1">Workspace name</Label>
					<Input id="name-1" name="Workspace name" value={workspaceName} onChange={e => setWorkspaceName(e.target.value)} />
				</div>
				<Button type="submit">Create</Button>
			</div>
		</form>
	)
}
