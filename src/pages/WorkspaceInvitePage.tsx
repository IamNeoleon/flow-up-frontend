import { useState, type FC } from 'react';
import { useParams } from 'react-router';
import { toast } from 'sonner';
import { useCheckInviteQuery, useJoinWorkspaceMutation } from '@/features/workspace/api/workspaceApi';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/shared/ui/shadcn/dialog"
import { Button } from '@/shared/ui/shadcn/button';
import { Spinner } from '@/shared/ui/shadcn/spinner';
import { getWorkspaceRole } from '@/shared/lib/get-workspace-role';
import { useTranslation } from 'react-i18next';

const WorkspaceInvitePage: FC = () => {
	const [open, setOpen] = useState(true)
	const { t } = useTranslation()

	const { token } = useParams()
	if (!token) {
		return <div>{t("errors.inviteNotFound")}</div>
	}

	const { data, isLoading: isLoadingInvite, isError: isErrorInvite } = useCheckInviteQuery(token)
	const [join] = useJoinWorkspaceMutation()

	const handleJoinWorkspace = () => {
		toast.promise(
			join(token).unwrap(),
			{
				loading: t("workspace.inviteLoading"),
				success: (result) => {
					setOpen(false)
					if (typeof result === 'object' && 'message' in result) {
						return result.message
					}
					return t("workspace.inviteSuccess")
				},
				error: t("workspace.inviteError"),
			}
		)
	}

	return (
		<>
			<Dialog open={open}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{t("workspace.inviteTitle")}</DialogTitle>
						<DialogDescription>
							{t("workspace.inviteDescription")}
						</DialogDescription>
					</DialogHeader>
					<div>
						{data && (
							<>
								<div>{t("workspace.inviteWorkspaceLabel")}: </div>
								<div>{t("workspace.inviteRoleLabel")}: {getWorkspaceRole(data.role)}</div>
							</>
						)}
					</div>
					<Button onClick={handleJoinWorkspace} disabled={isErrorInvite || isLoadingInvite}>
						{isLoadingInvite ? <Spinner /> : t("workspace.inviteAccept")}
					</Button>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default WorkspaceInvitePage
