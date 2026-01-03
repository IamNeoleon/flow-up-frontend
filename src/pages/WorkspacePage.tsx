import { type FC } from 'react';
import { useParams } from 'react-router';
import { WorkspaceHeader } from '@/features/workspace/components/WorkspaceHeader';
import { useAppSelector } from '@/shared/hooks/redux';
import { selectUser } from '@/store/slices/userSlice';
import { useGetWorkspaceQuery } from '@/api/endpoints/workspaceApi';
import { useWorkspaceRole } from '@/shared/hooks/useWorkspaceRole';
import { WorkspaceStats } from '@/features/workspace/components/WorkspaceStat';
import { BoardList } from '@/features/board/components/BoardList';
import { WorkspaceRecent } from '@/features/workspace/components/WorkspaceRecent';
import { WorkspaceMembers } from '@/features/workspace/components/WorkspaceMembers2';

export const WorkspacePage: FC = () => {
	const { id } = useParams()
	if (!id) {
		return (
			<div>Не найден воркспейс с таким id</div>
		)
	}
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
			<WorkspaceHeader isOwner={isOwner} workspaceId={id} workspaceName={workspace.name} workspaceDescription={workspace.description} />
			<WorkspaceStats />
			<div className='pb-10 border-b'>
				<h2 className='text-2xl font-medium mb-5'>Доски</h2>
				<BoardList boards={workspace.boards} workspaceId={workspace.id} />
			</div>
			<div className='pt-5 flex gap-10'>
				<div className='flex-auto'>
					<WorkspaceRecent />
				</div>
				<div className='flex-[0_0_30%]'>
					<WorkspaceMembers workspaceId={workspace.id} />
				</div>
			</div>
			{/* <WorkspaceBlock id={id} /> */}
		</>
	);
};