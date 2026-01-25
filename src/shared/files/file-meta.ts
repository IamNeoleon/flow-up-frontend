import { type FileKind } from './file-types';

export const MIME_MAP: Record<
   string,
   { kind: FileKind; ext: string }
> = {
   'application/pdf': { kind: 'pdf', ext: 'pdf' },

   'application/msword': { kind: 'word', ext: 'doc' },
   'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {
      kind: 'word',
      ext: 'docx',
   },

   'application/vnd.ms-excel': { kind: 'excel', ext: 'xls' },
   'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
      kind: 'excel',
      ext: 'xlsx',
   },

   'application/vnd.ms-powerpoint': { kind: 'ppt', ext: 'ppt' },
   'application/vnd.openxmlformats-officedocument.presentationml.presentation': {
      kind: 'ppt',
      ext: 'pptx',
   },

   'image/jpeg': { kind: 'image', ext: 'jpg' },
   'image/png': { kind: 'image', ext: 'png' },
   'image/webp': { kind: 'image', ext: 'webp' },

   'text/plain': { kind: 'txt', ext: 'txt' },

   'application/zip': { kind: 'zip', ext: 'zip' },
   'application/x-zip-compressed': { kind: 'zip', ext: 'zip' },
};
