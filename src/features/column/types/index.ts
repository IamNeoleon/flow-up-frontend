export interface ICreateColumnDto {
   boardId: string,
   name: string,
   color?: string,
   status: TColumnStatus
}

export type TColumnStatus = "TODO" | "IN_PROGRESS" | "DONE"