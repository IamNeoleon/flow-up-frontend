import type { IUser } from "@/features/user/types/user"

/* ================= TYPES ================= */

type TaskActivityType =
   | "TASK_CREATED"
   | "TASK_MOVED"
   | "TASK_ASSIGNED"
   | "TASK_COMMENTED"
   | "TASK_DELETED"

type ColumnActivityType =
   | "COLUMN_CREATED"
   | "COLUMN_DELETED"

type UserActivityType =
   | "USER_JOINED"
   | "USER_LEFT"


export type TWorkspaceActivityType =
   | TaskActivityType
   | ColumnActivityType
   | UserActivityType


/* ================= METADATA ================= */

type TaskMetadata = {
   taskName: string
   columnName: string
}

type ColumnMetadata = {
   columnName: string
}

type UserMetadata = {
   username: string
}

/* ================= FINAL ================= */

export interface TaskActivity {
   id: string
   user: Pick<IUser, "username" | "avatar">
   workspaceId: string
   createdAt: string
   type: TaskActivityType
   metadata: TaskMetadata
}

export interface ColumnActivity {
   id: string
   user: Pick<IUser, "username">
   workspaceId: string
   createdAt: string
   type: ColumnActivityType
   metadata: ColumnMetadata
}

export interface UserActivity {
   id: string
   user: Pick<IUser, "username">
   workspaceId: string
   createdAt: string
   type: UserActivityType
   metadata: UserMetadata
}

export type IWorkspaceActivity =
   | TaskActivity
   | ColumnActivity
   | UserActivity
