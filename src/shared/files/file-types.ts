import type { LucideIcon } from 'lucide-react';
import {
   File,
   FileText,
   FileSpreadsheet,
   Presentation,
   Image as ImageIcon,
   Archive,
} from 'lucide-react';

export type FileKind =
   | 'pdf'
   | 'word'
   | 'excel'
   | 'ppt'
   | 'image'
   | 'zip'
   | 'txt'
   | 'file';

export const FILE_KIND_ICON: Record<FileKind, LucideIcon> = {
   pdf: FileText,
   word: FileText,
   excel: FileSpreadsheet,
   ppt: Presentation,
   image: ImageIcon,
   zip: Archive,
   file: File,
   txt: FileText,
};

export const MAX_SIZE = 25 * 1024 * 1024;

export const ALLOWED_MIME = new Set([
   "application/pdf",

   "application/msword",
   "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

   "application/vnd.ms-excel",
   "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

   "application/vnd.ms-powerpoint",
   "application/vnd.openxmlformats-officedocument.presentationml.presentation",

   "image/jpeg",
   "image/png",
   "image/webp",

   "application/zip",
   "text/plain",
]);

export const ALLOWED_EXT = new Set([
   "pdf", "doc", "docx",
   "xls", "xlsx",
   "ppt", "pptx",
   "jpg", "jpeg", "png", "webp",
   "zip",
   "txt",
]);
