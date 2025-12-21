import type { IColumn } from "./column.types"

export interface IBoard {
	id: string,
	name: string,
	description: string,
	workspaceId: string
	columns: IColumn[]
}