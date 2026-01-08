import { type FC } from 'react';
import { useParams } from 'react-router';
import { skipToken } from '@reduxjs/toolkit/query';
import { useGetWorkspaceQuery } from '@/api/endpoints/workspaceApi';
import { useWorkspacePermissions } from '@/shared/hooks/useWorkspacePermissions';
import { WorkspaceHeader } from '@/features/workspace/components/WorkspaceHeader';
import { WorkspaceStats } from '@/features/workspace/components/WorkspaceStat';
import { BoardList } from '@/features/board/components/BoardList';
import { WorkspaceRecent } from '@/features/workspace/components/WorkspaceRecent';
import { WorkspaceMembers } from '@/features/workspace/components/WorkspaceMembers';

export const WorkspacePage: FC = () => {
	const { id } = useParams()
	const { data: workspace } = useGetWorkspaceQuery(id ?? skipToken)
	const { permissions } = useWorkspacePermissions(id)


	if (!id) {
		return (
			<div>Не найден воркспейс с таким id</div>
		)
	}

	if (!workspace) {
		return (
			<div>Не найден воркспейс с таким id</div>
		)
	}

	return (
		<>
			<WorkspaceHeader permissions={permissions} workspaceId={id} workspaceName={workspace.name} workspaceDescription={workspace.description} />
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
		</>
	);
};