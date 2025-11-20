export interface ICreateWorkspaceBody {
	name: string
}

export interface IWorkspace {
	id: string
	name: string
	ownerId: string
	Board: IBoard[]

}
export interface IBoard {
	id: string
	name: string
}