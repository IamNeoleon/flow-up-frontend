import { useGetWorkspaceQuery } from '@/api/endpoints/workspaceApi';
import { type FC } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs"
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
				<div className='mb-4'>
					<h1 className='text-4xl mb-3 capitalize'>{workspace.name}</h1>
					<div className='desc'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quia adipisci eos saepe laudantium culpa ad facere incidunt voluptatem nesciunt obcaecati neque, cumque autem consequatur dolore ratione soluta suscipit eveniet aspernatur.</div>
				</div>
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