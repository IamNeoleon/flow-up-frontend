import { type FC } from 'react';
import { Link } from 'react-router';
import { Plus } from 'lucide-react';
import { BoardCard } from '@/shared/ui/BoardCard';
import type { IBoard } from '@/shared/types/board.types';
import { Button } from '@/shared/ui/shadcn/button';
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
			<div className='flex gap-5 flex-wrap'>
				{boards.map(board => (
					<Link key={board.id} to={`/workspaces/${workspaceId}/boards/${board.id}`}>
						<BoardCard id={board.id} title={board.name} />
					</Link>
				))}
			</div>
		</>
	);
};