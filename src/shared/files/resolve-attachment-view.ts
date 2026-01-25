import { MIME_MAP } from './file-meta';
import { FILE_KIND_ICON, type FileKind } from './file-types';
import { getExtFromName } from './get-ext-from-name';

export function resolveAttachmentView(params: {
   mimeType?: string | null;
   filename?: string | null;
   url?: string | null;
}) {
   const mime = params.mimeType?.toLowerCase().trim() ?? '';

   const fromMime = MIME_MAP[mime];
   const ext =
      getExtFromName(params.filename ?? undefined) ??
      fromMime?.ext ??
      '';

   const kind: FileKind = fromMime?.kind ?? 'file';

   return {
      kind,
      ext,
      Icon: FILE_KIND_ICON[kind],
   };
}
