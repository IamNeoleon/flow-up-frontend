import { type FC } from 'react';
import { Link } from 'react-router';
import { Plus } from 'lucide-react';
import { BoardCard } from '@/components/BoardCard/BoardCard';
import type { IBoard } from '@/shared/types/board.types';
import { Button } from '@/shared/ui/button';
import { useModal } from '@/app/providers/ModalProvider';
import { CreateBoard } from '@/features/board/components/CreateBoard';

interface IBoardListProps {
	boards: IBoard[],
	workspaceId: string
}

export const BoardList: FC<IBoardListProps> = ({ boards, workspaceId }) => {
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
					<Link key={board.id} to={`/workspaces/${workspaceId}/boards/${board.id}`}>
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