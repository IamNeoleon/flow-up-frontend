import type { IUser } from "@/features/user/types/user";

export interface ITaskComment {
   id: string;
   content: string;
   taskId: string;
   authorId: string;
   author: Pick<IUser, 'id' | 'username' | 'avatar'>
   createdAt: string;
   updatedAt: string;
}