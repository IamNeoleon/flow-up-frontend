import { type IBoard } from './board.types'
import type { IUser } from './user.types'

export interface IWorkspace {
	id: string
	name: string
	description?: string
	ownerId: string
	boards: IBoard[]
}

export interface ICreateWorkspaceBody {
	name: string
}

export interface IWorkspaceMember {
	id: string,
	role: TWorkspaceRole,
	userId: string,
	workspaceId: string,
	user: IUser
}

export type TWorkspaceRole = 'OWNER' | 'EDITOR' | 'MEMBER'

export const WORKSPACE_ROLE_LABEL: Record<TWorkspaceRole, string> = {
	OWNER: 'Владелец',
	EDITOR: 'Редактор',
	MEMBER: 'Участник',
}
