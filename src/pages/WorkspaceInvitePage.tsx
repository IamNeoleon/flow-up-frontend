import { useState, type FC } from 'react';
import { useParams } from 'react-router';
import { toast } from 'sonner';
import { useCheckInviteQuery, useJoinWorkspaceMutation } from '@/api/endpoints/workspaceApi';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/shared/ui/shadcn/dialog"
import { Button } from '@/shared/ui/shadcn/button';
import { Spinner } from '@/shared/ui/shadcn/spinner';
import { getWorkspaceRole } from '@/shared/lib/utils/utils';

export const WorkspaceInvitePage: FC = () => {
	const [open, setOpen] = useState(true)

	const { token } = useParams()
	if (!token) {
		return <div>Не найдено приглашение</div>
	}

	const { data, isLoading: isLoadingInvite, isError: isErrorInvite } = useCheckInviteQuery(token)
	const [join] = useJoinWorkspaceMutation()

	const handleJoinWorkspace = () => {
		toast.promise(
			join(token).unwrap(),
			{
				loading: 'Добавляемся...',
				success: (result) => {
					setOpen(false)
					if (typeof result === 'object' && 'message' in result) {
						return result.message
					}
					return 'Вы были успешно добавлены в воркспейс!'
				},
				error: 'Не удалось вступить в воркспейс',
			}
		)
	}

	return (
		<>
			<Dialog open={open}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Добавление в воркспейс</DialogTitle>
						<DialogDescription>
							Вы были приглашены по ссылке-приглашению в воркспейс.
							Если вам это интересно, то вступайте.
						</DialogDescription>
					</DialogHeader>
					<div>
						{data && (
							<>
								<div>Workspace: </div>
								<div>Роль: {getWorkspaceRole(data.role)}</div>
							</>
						)}
					</div>
					<Button onClick={handleJoinWorkspace} disabled={isErrorInvite || isLoadingInvite}>{isLoadingInvite ? <Spinner /> : 'Принять приглашение'}</Button>
				</DialogContent>
			</Dialog>
		</>
	);
};