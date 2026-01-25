import { type FC } from 'react';
import { Link } from 'react-router';
import { BoardCard } from '@/shared/ui/BoardCard';
import type { IBoard } from '../types/board';

interface IBoardListProps {
	boards: IBoard[],
	workspaceId: string
}

export const BoardList: FC<IBoardListProps> = ({ boards, workspaceId }) => {

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