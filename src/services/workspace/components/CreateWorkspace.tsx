import { useState, type FC } from "react"
import { toast } from "sonner"
import { Button } from "@/shared/ui/shadcn/button"
import { Input } from "@/shared/ui/shadcn/input"
import { Label } from "@/shared/ui/shadcn/label"
import { useTranslation } from "react-i18next"
import { useCreateWorkspaceMutation } from "../api/workspaceApi"
import { Spinner } from "@/shared/ui/shadcn/spinner"

export const CreateWorkspace: FC<{ close: () => void }> = ({ close }) => {
	const { t } = useTranslation()

	const [create, { isLoading }] = useCreateWorkspaceMutation()

	const [workspaceName, setWorkspaceName] = useState<string>('')

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (isLoading) return

		try {
			await create({
				name: workspaceName
			}).unwrap()

			toast.success(t("workspace.createSuccess"))
		} catch (error) {
			toast.error(t("workspace.createError"))
		}

		close()
	}

	return (
		<form onSubmit={handleSubmit}>
			<div className="grid gap-4">
				<div className="grid gap-3">
					<Label htmlFor="name-1">{t("workspace.nameLabel")}</Label>
					<Input id="name-1" name="Workspace name" value={workspaceName} onChange={e => setWorkspaceName(e.target.value)} />
				</div>
				<Button disabled={isLoading} type="submit">
					{
						!isLoading ? (
							t("common.create")
						) : (
							<Spinner />
						)
					}
				</Button>
			</div>
		</form>
	)
}
