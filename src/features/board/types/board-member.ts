import type { IUser } from "@/features/user/types/user";
import type { TBoardRole } from "./board-role";

export interface IBoardMember {
   userId: string,
   user: IUser,
   boardRole: TBoardRole
}