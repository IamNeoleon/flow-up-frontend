import { Button } from "@/components/ui/button"
import {
	DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"

interface ICreateDialogProps {
	onSubmit: (workspaceName: string) => void
}

export function CreateDialog({ onSubmit }: ICreateDialogProps) {
	const [workspaceName, setWorkspaceName] = useState<string>('')

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		onSubmit(workspaceName)
	}

	return (
		<form onSubmit={handleSubmit}>
			<div className="grid gap-4">
				<div className="grid gap-3">
					<Label htmlFor="name-1">Workspace name</Label>
					<Input id="name-1" name="Workspace name" value={workspaceName} onChange={e => setWorkspaceName(e.target.value)} />
				</div>
				<DialogClose asChild>
					<Button type="submit">Create</Button>
				</DialogClose>
			</div>
		</form>
	)
}
