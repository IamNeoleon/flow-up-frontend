export interface ITaskAttachment {
   id: string,
   filename: string,
   key: string,
   mimeType: string,
   size: number
   status: string
   taskId: string
   createdAt: string
}

export interface ITaskPresignedAtchBody {
   fileName: string,
   mimeType: string,
   size: number
}

export interface ITaskPresignedAtchResponse {
   attachmentId: string,
   key: string,
   uploadUrl: string,
   method: 'PUT'
}