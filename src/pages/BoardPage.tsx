import { useGetBoardQuery } from '@/services/board/api/boardApi'
import { BoardHeader } from '@/services/board/components/BoardHeader'
import { ColumnList } from '@/services/column/components/ColumnList'
import { useAppDispatch, useAppSelector } from '@/shared/hooks/redux'
import { useBoardPermissions } from '@/shared/hooks/use-board-permissions'
import { selectUser } from '@/store/slices/userSlice'
import { useEffect, type FC } from 'react'
import { useParams } from 'react-router'
import { skipToken } from '@reduxjs/toolkit/query'
import { setCurrentBoardId, setPermissions } from '@/store/slices/boardSlice'
import { useCurrentWorkspace } from '@/shared/hooks/use-current-workspace'
import { useWsBoard } from '@/services/board/api/useWsBoard'
import { useWsBoardEvents } from '@/shared/lib/use-ws-board-events'
import { useTranslation } from 'react-i18next'

const BoardPage: FC = () => {
	const { t } = useTranslation()
	const { boardId, workspaceId } = useParams()
	const { currentWorkspace } = useCurrentWorkspace(workspaceId)

	const dispatch = useAppDispatch()
	const user = useAppSelector(selectUser)

	const { ws } = useWsBoard(boardId)
	const { onTaskCreated, onTaskDeleted, onTaskUpdated, onTaskCommented } = useWsBoardEvents(user?.id)

	const { data: board, isLoading, isError } = useGetBoardQuery(
		boardId && workspaceId
			? { boardId, workspaceId }
			: skipToken
	)

	const { permissions, role } = useBoardPermissions(
		workspaceId ?? '',
		boardId ?? '',
		user?.id ?? ''
	)

	useEffect(() => {
		if (boardId) {
			dispatch(setCurrentBoardId(boardId))
		}
	}, [boardId])

	useEffect(() => {
		dispatch(setPermissions(permissions))
	}, [permissions, role])

	useEffect(() => {
		if (!ws || !boardId || !user) return

		ws.on("TASK_CREATED", onTaskCreated)
		ws.on("TASK_UPDATED", onTaskUpdated)
		ws.on("TASK_DELETED", onTaskDeleted)
		ws.on("TASK_COMMENTED", onTaskCommented)

		return () => {
			ws.off("TASK_CREATED", onTaskCreated)
			ws.off("TASK_UPDATED", onTaskUpdated)
			ws.off("TASK_DELETED", onTaskDeleted)
			ws.off("TASK_COMMENTED", onTaskCommented)
		}
	}, [ws, boardId, user?.id])

	if (!user) {
		return <div>{t("errors.unauthorized")}</div>
	}

	if (!boardId || !workspaceId) {
		return <div>{t("errors.missingId")}</div>
	}

	if (isLoading) {
		return <div>{t("common.loading")}</div>
	}

	if (isError || !board) {
		return <div>{t("errors.boardLoad")}</div>
	}

	return (
		<>
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
		</>
	)
}

export default BoardPage;
