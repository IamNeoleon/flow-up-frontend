import { type IBoard } from './board.types'

export interface IWorkspace {
	id: string
	name: string
	ownerId: string
	Board: IBoard[]
}

export interface ICreateWorkspaceBody {
	name: string
}