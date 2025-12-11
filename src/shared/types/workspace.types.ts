import { type IBoard } from './board.types'

export interface IWorkspace {
	id: string
	name: string
	ownerId: string
	boards: IBoard[]
}

export interface ICreateWorkspaceBody {
	name: string
}