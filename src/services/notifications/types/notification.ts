interface DeadlineSoonMeta {
   taskId: string;
   taskName: string;
   colId: string;
   dueAt: string
   boardId: string,
   workspaceId: string
}

interface DeadlineOverdueMeta {
   taskId: string;
   taskName: string;
   colId: string;
   dueAt: string
   boardId: string,
   workspaceId: string
}

interface StatusChangeMeta {
   taskId: string;
   taskName: string;
   colId: string;
   boardId: string,
   workspaceId: string
}

interface AddAssigmentMeta {
   taskId: string;
   taskName: string;
   colId: string;
   boardId: string,
   workspaceId: string
}

interface RemoveAssigmentMeta {
   taskId: string;
   taskName: string;
   colId: string;
   boardId: string,
   workspaceId: string
}

interface CommentMentionMeta {
   actorName: string,
   taskId: string;
   taskName: string;
   colId: string;
   boardId: string,
   workspaceId: string
}

export type Notification =
   | {
      id: string;
      userId: string;
      type: "STATUS_CHANGE";
      metadata: StatusChangeMeta;
      sourceId: string;
      read: boolean;
      createdAt: string;
   }
   | {
      id: string;
      userId: string;
      type: "ADD_ASSIGMENT";
      metadata: AddAssigmentMeta;
      sourceId: string;
      read: boolean;
      createdAt: string;
   }
   | {
      id: string;
      userId: string;
      type: "REMOVE_ASSIGMENT";
      metadata: RemoveAssigmentMeta;
      sourceId: string;
      read: boolean;
      createdAt: string;
   }
   | {
      id: string;
      userId: string;
      type: "COMMENT_MENTION";
      metadata: CommentMentionMeta;
      sourceId: string;
      read: boolean;
      createdAt: string;
   }
   | {
      id: string;
      userId: string;
      type: "DEADLINE_SOON";
      metadata: DeadlineSoonMeta;
      sourceId: string;
      read: boolean;
      createdAt: string;
   }
   | {
      id: string;
      userId: string;
      type: "DEADLINE_OVERDUE";
      metadata: DeadlineOverdueMeta;
      sourceId: string;
      read: boolean;
      createdAt: string;
   };


