import type { TBoardRole } from "../constants/board.permissions"
import type { IUser } from "./user.types"

export interface IBoard {
	id: string,
	name: string,
	description: string,
	workspaceId: string
	createdAt: string,
	updatedAt: string
}

export interface IBoardMember {
	userId: string,
	user: IUser,
	boardRole: TBoardRole
}
