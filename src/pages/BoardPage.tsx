import { useGetBoardQuery } from '@/api/endpoints/boardApi';
import { type FC } from 'react';
import { useParams } from 'react-router';

export const BoardPage: FC = () => {
	const { boardId } = useParams()
	if (!boardId) {
		return <div>Не получено id</div>
	}
	const { data: board, isLoading } = useGetBoardQuery(boardId)

	return (
		<>
			<h1>{board?.name}</h1>
		</>
	);
};