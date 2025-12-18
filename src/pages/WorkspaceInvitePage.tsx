import { useState, type FC } from 'react';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { useCheckInviteQuery, useJoinWorkspaceMutation } from '@/api/endpoints/workspaceApi';
import { useParams } from 'react-router';
import { Button } from '@/components/ui/button';
import { getWorkspaceRole } from '@/lib/utils';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';

export const WorkspaceInvitePage: FC = () => {
	const [open, setOpen] = useState(true)

	const { token } = useParams()
	if (!token) {
		return <div>Не найдено приглашение</div>
	}

	const { data, isLoading: isLoadingInvite, isError: isErrorInvite, error } = useCheckInviteQuery(token)
	const [join, { data: dataJoin }] = useJoinWorkspaceMutation()

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
					<Button onClick={handleJoinWorkspace} disabled={isErrorInvite}>{isLoadingInvite ? <Spinner /> : 'Принять приглашение'}</Button>
				</DialogContent>
			</Dialog>
		</>
	);
};