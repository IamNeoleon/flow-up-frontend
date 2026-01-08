import { useGetBoardQuery } from '@/api/endpoints/boardApi'
import { BoardHeader } from '@/features/board/components/BoardHeader'
import { ColumnList } from '@/features/column/components/ColumnList'
import { useAppDispatch, useAppSelector } from '@/shared/hooks/redux'
import { useBoardPermissions } from '@/shared/hooks/useBoardPermissions'
import { selectUser } from '@/store/slices/userSlice'
import { useEffect, type FC } from 'react'
import { useParams } from 'react-router'
import { skipToken } from '@reduxjs/toolkit/query'
import { setPermissions } from '@/store/slices/boardSlice'
import { useCurrentWorkspace } from '@/shared/hooks/useCurrentWorkspace'

export const BoardPage: FC = () => {
	const dispatch = useAppDispatch()
	const { boardId, workspaceId } = useParams()
	const user = useAppSelector(selectUser)
	const { currentWorkspace } = useCurrentWorkspace(workspaceId)

	const { data: board, isLoading, isError } = useGetBoardQuery(
		boardId && workspaceId
			? { boardId, workspaceId }
			: skipToken
	)

	const { permissions } = useBoardPermissions(
		workspaceId ?? '',
		boardId ?? '',
		user?.id ?? ''
	)

	useEffect(() => {
		dispatch(setPermissions(permissions))
	}, [permissions])

	if (!user) {
		return <div>Пользователь не авторизован</div>
	}

	if (!boardId || !workspaceId) {
		return <div>Не получено id</div>
	}

	if (isLoading) {
		return <div>Загрузка...</div>
	}

	if (isError || !board) {
		return <div>Ошибка загрузки доски</div>
	}

	return (
		<div className="px-8 py-5">
			<BoardHeader
				workspaceId={board.workspaceId}
				boardId={board.id}
				boardTitle={board.name}
				boardDescription={board.description}
				currentWorkspace={currentWorkspace}
			/>
			<ColumnList boardId={board.id} />
		</div>
	)
}
