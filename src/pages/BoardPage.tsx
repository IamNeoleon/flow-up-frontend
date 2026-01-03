import { useGetBoardQuery } from '@/api/endpoints/boardApi';
import { useModal } from '@/app/providers/ModalProvider';
import { BoardHeader } from '@/features/board/components/BoardHeader';
import { ColumnList } from '@/features/column/components/ColumnList';
import { CreateColumn } from '@/features/column/components/CreateColumn';
import { Button } from '@/shared/ui/shadcn/button';
import { Plus } from 'lucide-react';
import { type FC } from 'react';
import { useParams } from 'react-router';

export const BoardPage: FC = () => {
	const { boardId, workspaceId } = useParams()
	if (!boardId || !workspaceId) {
		return <div>Не получено id</div>
	}
	const { data: board, isLoading, isError } = useGetBoardQuery({ boardId, workspaceId })
	const { open, close } = useModal()

	if (isLoading) {
		return <div>Загрузка...</div>
	}

	if (isError) {
		return <div>Ошибка загрузки доски</div>
	}

	if (!board) {
		return <div>Доска не найдена</div>
	}

	const handleCreateCol = () => {
		open({
			title: 'Создать колонку',
			description: 'Создание колонки',
			content: <CreateColumn boardId={board.id} close={close} />
		})
	}

	return (
		<>
			<div className='p-20'>
				<BoardHeader workspaceId={board.workspaceId} boardId={board.id} boardTitle={board.name} boardDescription={board.description} />
				<ColumnList boardId={board.id} />
				<Button onClick={handleCreateCol} className='flex items-center fixed bottom-14 right-10' variant='outline'>
					<Plus />
					<span>Создать колонку</span>
				</Button>
			</div>
		</>
	);
};