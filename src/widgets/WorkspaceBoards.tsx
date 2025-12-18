import { type FC } from 'react';
import { BoardCard } from '@/components/BoardCard/BoardCard';
import type { IBoard } from '@/shared/types/board.types';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useModal } from '@/app/providers/ModalProvider';
import { CreateBoard } from '@/features/create-board/ui/CreateBoard';
import { Link } from 'react-router';

interface IWorkspaceBoardsProps {
	boards: IBoard[],
	workspaceId: string
}

export const WorkspaceBoards: FC<IWorkspaceBoardsProps> = ({ boards, workspaceId }) => {
	const { open, close } = useModal()

	const handleCreateBoard = () => {
		open({
			title: 'Создание доски',
			description: "Создайте новую доску",
			content: <CreateBoard close={close} workspaceId={workspaceId} />
		})
	}

	return (
		<>
			<div className='grid grid-cols-4 gap-4'>
				{boards.map(board => (
					<Link key={board.id} to={`/board/${board.id}`}>
						<BoardCard id={board.id} title={board.name} />
					</Link>
				))}
			</div>
			<Button onClick={handleCreateBoard} className='flex items-center fixed bottom-14 right-10' variant='outline'>
				<Plus />
				<span>Создать доску</span>
			</Button>
		</>
	);
};