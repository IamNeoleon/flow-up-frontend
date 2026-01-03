import { useGetWorkspaceQuery } from '@/api/endpoints/workspaceApi';
import { type FC } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/shadcn/tabs"
import { BoardList } from '../features/board/components/BoardList';
import { useWorkspaceRole } from '@/shared/hooks/useWorkspaceRole';
import { WorkspaceMembers } from '../features/workspace/components/WorkspaceMembers';
import { useAppSelector } from '@/shared/hooks/redux';
import { selectUser } from '@/store/slices/userSlice';

interface IWorkspaceBlockProps {
	id: string
}

export const WorkspaceBlock: FC<IWorkspaceBlockProps> = ({ id }) => {
	const user = useAppSelector(selectUser)
	const { data: workspace } = useGetWorkspaceQuery(id)
	const role = useWorkspaceRole(id, user?.id)
	const isOwner = role === 'OWNER'

	if (!workspace) {
		return (
			<div>Не найден воркспейс с таким id</div>
		)
	}

	return (
		<>
			<div>

				<Tabs defaultValue="boards" className="w-full">
					<TabsList className='py-5 mb-2'>
						<TabsTrigger className='py-4' value="boards">Доски</TabsTrigger>
						{
							isOwner && (
								<>
									<TabsTrigger className='py-4' value="members">Участники</TabsTrigger>
									<TabsTrigger className='py-4' value="settings">Настройки</TabsTrigger>
								</>
							)
						}
					</TabsList>
					<TabsContent value="boards">
						<BoardList workspaceId={id} boards={workspace.boards} />
					</TabsContent>
					<TabsContent value="members">
						<WorkspaceMembers workspaceId={workspace.id} />
					</TabsContent>
					<TabsContent value="settings">Change your settings here.</TabsContent>
				</Tabs>
			</div>
		</>
	);
};