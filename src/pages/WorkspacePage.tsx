import { useEffect, useRef, type FC } from 'react';
import { useParams } from 'react-router';
import { skipToken } from '@reduxjs/toolkit/query';
import { useGetActivityQuery, useGetWorkspaceQuery } from '@/features/workspace/api/workspaceApi';
import { useWorkspacePermissions } from '@/shared/hooks/use-workspace-permissions';
import { WorkspaceHeader } from '@/features/workspace/components/WorkspaceHeader';
import { WorkspaceStats } from '@/features/workspace/components/WorkspaceStat';
import { BoardList } from '@/features/board/components/BoardList';
import { WorkspaceRecent } from '@/features/workspace/components/WorkspaceRecent';
import { WorkspaceMembers } from '@/features/workspace/components/WorkspaceMembers';
import { io, type Socket } from 'socket.io-client';
import { getTokenFromLs } from '@/shared/lib/localStorage';

const WorkspacePage: FC = () => {
	const token = getTokenFromLs()
	const { workspaceId } = useParams()
	const { data: workspace } = useGetWorkspaceQuery(workspaceId ?? skipToken)
	const { refetch } = useGetActivityQuery(workspaceId ?? skipToken)
	const { permissions } = useWorkspacePermissions(workspaceId)
	const socketRef = useRef<Socket | null>(null);

	useEffect(() => {
		if (!workspaceId) return;

		const socket = io('http://localhost:3000/workspace', {
			withCredentials: true,
			auth: { token }
		});

		socketRef.current = socket;

		socket.on('connect', () => {
			console.log('WS connected:', socket.id);

			socket.emit('JOIN_WORKSPACE_ROOM', {
				workspaceId,
			});
		});

		socket.on('WORKSPACE_UPDATED', (payload: { workspaceId: string }) => {
			console.log('WORKSPACE_UPDATED:', payload);
			refetch()
		});

		socket.on('disconnect', () => {
			console.log('WS disconnected');
		});

		return () => {
			socket.disconnect();
		};
	}, [workspaceId]);

	if (!workspaceId) {
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
			<WorkspaceHeader workspace={workspace} permissions={permissions} />
			<WorkspaceStats workspaceId={workspaceId} />
			<div className='pb-10 border-b'>
				<h2 className='text-2xl font-medium mb-5'>Доски</h2>
				<BoardList boards={workspace.boards} workspaceId={workspace.id} />
			</div>
			<div className='pt-5 flex gap-10'>
				<div className='flex-auto'>
					<WorkspaceRecent workspaceId={workspaceId} />
				</div>
				<div className='flex-[0_0_30%]'>
					<WorkspaceMembers permissions={permissions} workspaceId={workspace.id} />
				</div>
			</div>
		</>
	);
};

export default WorkspacePage;