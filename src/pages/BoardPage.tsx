import { useGetBoardQuery } from '@/api/endpoints/boardApi';
import { BoardBlock } from '@/widgets/BoardBlock';
import { type FC } from 'react';
import { useParams } from 'react-router';

export const BoardPage: FC = () => {
	const { boardId, workspaceId } = useParams()
	if (!boardId || !workspaceId) {
		return <div>Не получено id</div>
	}
	const { data: board, isLoading } = useGetBoardQuery({ boardId, workspaceId })

	return (
		<>
			<div className='p-20'>
				{
					board && <BoardBlock board={board} />
				}
			</div>
		</>
	);
};