import { useGetWorkspaceQuery } from '@/api/endpoints/workspaceApi';
import { type FC } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WorkspaceBoards } from './WorkspaceBoards';
import { useWorkspaceRole } from '@/shared/hooks/useWorkspaceRole';

interface IWorkspaceBlockProps {
	id: string
}

export const WorkspaceBlock: FC<IWorkspaceBlockProps> = ({ id }) => {
	const { data: workspace } = useGetWorkspaceQuery(id)
	// const {} = useWorkspaceRole()

	if (!workspace) {
		return (
			<div>Не найден воркспейс с таким id</div>
		)
	}

	return (
		<>
			<div className=''>
				<div className='mb-4'>
					<h1 className='text-4xl mb-3 capitalize'>{workspace.name}</h1>
					<div className='desc'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quia adipisci eos saepe laudantium culpa ad facere incidunt voluptatem nesciunt obcaecati neque, cumque autem consequatur dolore ratione soluta suscipit eveniet aspernatur.</div>
				</div>
				<Tabs defaultValue="boards" className="w-full">
					<TabsList className='py-5 mb-2'>
						<TabsTrigger className='py-4' value="boards">Доски</TabsTrigger>
						<TabsTrigger className='py-4' value="members">Участники</TabsTrigger>
						<TabsTrigger className='py-4' value="settings">Настройки</TabsTrigger>
					</TabsList>
					<TabsContent value="boards">
						<WorkspaceBoards boards={workspace.boards} />
					</TabsContent>
					<TabsContent value="members">Change your password here.</TabsContent>
					<TabsContent value="settings">Change your settings here.</TabsContent>
				</Tabs>
			</div>
		</>
	);
};