import { type FC } from 'react';
import { BoardCard } from '@/components/BoardCard/BoardCard';
import type { IBoard } from '@/shared/types/board.types';

interface IWorkspaceBoardsProps {
	boards: IBoard[]
}

export const WorkspaceBoards: FC<IWorkspaceBoardsProps> = ({ boards }) => {
	return (
		<>
			<div className='grid grid-cols-4 gap-4'>
				{boards.map(board => (
					<BoardCard key={board.id} id={board.id} title={board.name} />
				))}
				<BoardCard id='asd' title='asdasd' />
				<BoardCard id='asd' title='asdasd' />
				<BoardCard id='asd' title='asdasd' />
				<BoardCard id='asd' title='asdasd' />
			</div>
		</>
	);
};