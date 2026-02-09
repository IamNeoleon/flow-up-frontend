import type { IUser } from "@/services/user/types/user";

export interface ITaskComment {
   id: string;
   content: string;
   taskId: string;
   authorId: string;
   author: Pick<IUser, 'id' | 'username' | 'avatar' | 'fullName'>
   createdAt: string;
   updatedAt: string;
}