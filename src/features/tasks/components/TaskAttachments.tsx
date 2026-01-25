import React, { useMemo, useRef, useState } from "react";
import { Input } from "@/shared/ui/shadcn/input";
import {
   useCompleteTaskAttachmentMutation,
   useGetTaskAttachmentPresignedUrlMutation,
   useLazyGetDownloadPresignedUrlQuery,
} from "../api/taskApi";
import type { ITaskAttachment } from '../types/task-attachments';
import { TaskAttachment } from "./TaskAttachment";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
   DialogFooter,
} from "@/shared/ui/shadcn/dialog";
import { Button } from "@/shared/ui/shadcn/button";
import { Progress } from "@/shared/ui/shadcn/progress";
import { toast } from "sonner";
import { Upload } from "lucide-react";
import { MAX_SIZE, ALLOWED_MIME, ALLOWED_EXT } from "@/shared/files/file-types";
import { useAppSelector } from "@/shared/hooks/redux";
import { selectPermissions } from "@/store/slices/boardSlice";

type UploadState = "idle" | "selected" | "uploading" | "error" | "success";

interface ITaskAttachmentsProps {
   boardId: string;
   colId: string;
   taskId: string;
   attachments: ITaskAttachment[];
}

export const TaskAttachments = ({
   boardId,
   colId,
   taskId,
   attachments,
}: ITaskAttachmentsProps) => {
   const permissions = useAppSelector(selectPermissions)

   const [getPresigned] = useGetTaskAttachmentPresignedUrlMutation();
   const [complete] = useCompleteTaskAttachmentMutation();
   const [getDownloadUrl] = useLazyGetDownloadPresignedUrlQuery();


   const [open, setOpen] = useState(false);

   const inputRef = useRef<HTMLInputElement | null>(null);
   const xhrRef = useRef<XMLHttpRequest | null>(null);
   const [isDragOver, setIsDragOver] = useState(false);

   const [file, setFile] = useState<File | null>(null);
   const [state, setState] = useState<UploadState>("idle");
   const [progress, setProgress] = useState(0);
   const [errorText, setErrorText] = useState<string | null>(null);

   const canUpload = useMemo(() => state === "selected" && !!file, [state, file]);
   const isBusy = state === "uploading";

   const pickFile = (f: File, inputEl?: HTMLInputElement | null) => {
      if (f.size > MAX_SIZE) {
         setErrorText("Файл больше 25 МБ");
         if (inputEl) inputEl.value = "";
         return;
      }

      const ext = f.name.split(".").pop()?.toLowerCase();

      const isMimeOk = !!f.type && ALLOWED_MIME.has(f.type);
      const isExtOk = !!ext && ALLOWED_EXT.has(ext);

      if (!isMimeOk && !isExtOk) {
         setErrorText("Недопустимый тип файла");
         if (inputEl) inputEl.value = "";
         return;
      }

      setFile(f);
      setErrorText(null);
      setProgress(0);
      setState("selected");
   }


   const resetLocal = () => {
      setFile(null);
      setState("idle");
      setProgress(0);
      setErrorText(null);
      if (inputRef.current) inputRef.current.value = "";
   }

   const onDialogOpenChange = (v: boolean) => {
      setOpen(v);
      if (!v) {
         if (xhrRef.current) {
            try {
               xhrRef.current.abort();
            } catch { }
            xhrRef.current = null;
         }
         resetLocal();
      }
   }

   const openFileDialog = () => {
      if (isBusy) return;
      inputRef.current?.click();
   }

   const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (isBusy) return;
      setIsDragOver(true);
   }

   const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);
   }

   const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);
      if (isBusy) return;

      const f = e.dataTransfer.files?.[0];
      if (!f) return;

      pickFile(f, inputRef.current);
   }

   const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.currentTarget.files?.[0];
      if (!f) return;
      pickFile(f, e.currentTarget);
   }

   const uploadWithProgress = (url: string, f: File, mimeType: string) => {
      return new Promise<void>((resolve, reject) => {
         const xhr = new XMLHttpRequest();
         xhrRef.current = xhr;

         xhr.open("PUT", url, true);
         xhr.setRequestHeader("Content-Type", mimeType);

         xhr.upload.onprogress = (evt) => {
            if (!evt.lengthComputable) return;
            const p = Math.round((evt.loaded / evt.total) * 100);
            setProgress(p);
         };

         xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) resolve();
            else reject(new Error(`R2 upload failed: ${xhr.status}`));
         };

         xhr.onerror = () => reject(new Error("Network error during upload"));
         xhr.onabort = () => reject(new Error("Upload aborted"));

         xhr.send(f);
      });
   }

   const handleUpload = async () => {
      if (!file || isBusy) return;

      try {
         setState("uploading");
         setErrorText(null);
         setProgress(0);

         const mimeType = file.type || "application/octet-stream";

         const presigned = await getPresigned({
            boardId,
            colId,
            taskId,
            body: {
               fileName: file.name,
               mimeType,
               size: file.size,
            },
         }).unwrap();

         await uploadWithProgress(presigned.uploadUrl, file, mimeType);

         await complete({
            boardId,
            colId,
            taskId,
            attachmentId: presigned.attachmentId,
         }).unwrap();

         setState("success");
         setProgress(100);
         setFile(null);
         setOpen(false);

         toast.success("Вложение успешно загружено");
      } catch (err: any) {
         setState("error");
         setErrorText(err?.message ?? "Ошибка загрузки");
         xhrRef.current = null;
         toast.error("Не удалось загрузить вложение");
      }
   }

   const cancelUpload = () => {
      if (xhrRef.current) {
         try {
            xhrRef.current.abort();
         } catch { }
         xhrRef.current = null;
      }
      setState(file ? "selected" : "idle");
      setProgress(0);
      setErrorText(null);
   }

   const handleDownload = async (attId: string, fileName: string) => {
      const { url } = await getDownloadUrl({
         boardId,
         colId,
         taskId,
         attachmentId: attId,
      }).unwrap();

      const r = await fetch(url);
      const blob = await r.blob();
      const objectUrl = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();

      URL.revokeObjectURL(objectUrl);
   };

   return (
      <>
         <div className="flex flex-col gap-2 mb-5">
            {attachments.length > 0 ? attachments.map((att) => (
               <TaskAttachment
                  key={att.id}
                  onDownload={() => handleDownload(att.id, att.filename)}
                  att={att}
                  boardId={boardId}
                  colId={colId}
               />
            )) : (
               <div className="text-muted-foreground italic">Вложений нет</div>
            )}
         </div>
         <Dialog open={open} onOpenChange={onDialogOpenChange}>
            {
               permissions?.canDeleteTask && (
                  <DialogTrigger asChild>
                     <Button
                        variant="outline"
                        className="group gap-2 transition-all"
                     >
                        <Upload className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
                        Загрузить вложение
                     </Button>
                  </DialogTrigger>
               )
            }

            <DialogContent>
               <DialogHeader>
                  <DialogTitle>Загрузка вложения</DialogTitle>
                  <DialogDescription>
                     Выберите файл для загрузки в качестве вложения к задаче.
                     Максимальный размер файла: 25 МБ. <br />
                     Допустимые типы файлов: .pdf, .word, .excel, .ppt, .jpg, .png, .webp, .zip, .txt
                  </DialogDescription>
               </DialogHeader>

               <div className="space-y-2">
                  <Input
                     ref={inputRef}
                     id="task-attachment"
                     type="file"
                     onChange={onFileChange}
                     disabled={isBusy}
                     accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.webp,.zip,.txt"
                     className="hidden"
                  />

                  <div
                     onClick={openFileDialog}
                     onDragOver={onDragOver}
                     onDragLeave={onDragLeave}
                     onDrop={onDrop}
                     role="button"
                     tabIndex={0}
                     className={[
                        "w-full rounded-md border border-dashed px-4 py-10 text-sm transition",
                        "cursor-pointer select-none",
                        isBusy ? "opacity-60 pointer-events-none" : "",
                        isDragOver ? "border-primary bg-muted" : "border-input",
                     ].join(" ")}
                  >
                     <div className="flex flex-col gap-1 font-medium text-center">
                        Перетащите файл сюда или нажмите, чтобы выбрать
                     </div>
                  </div>

                  {file && (
                     <p className="text-sm text-muted-foreground">
                        Выбран файл: <span className="font-medium">{file.name}</span>
                     </p>
                  )}

                  {state === "uploading" && (
                     <div className="space-y-2">
                        <Progress value={progress} />
                        <p className="text-sm text-muted-foreground">{progress}%</p>
                     </div>
                  )}

                  {state === "error" && errorText && (
                     <p className="text-sm text-destructive">{errorText}</p>
                  )}
               </div>

               <DialogFooter className="flex-col sm:flex-col gap-2">
                  <Button
                     className="w-full"
                     onClick={handleUpload}
                     disabled={!canUpload || isBusy}
                  >
                     {isBusy ? "Загрузка..." : "Загрузить вложение"}
                  </Button>

                  {state === "uploading" && (
                     <Button
                        className="w-full"
                        variant="secondary"
                        onClick={cancelUpload}
                     >
                        Отменить
                     </Button>
                  )}

                  {(state === "selected" || state === "error") && (
                     <Button
                        className="w-full"
                        variant="ghost"
                        onClick={resetLocal}
                        disabled={isBusy}
                     >
                        Сбросить
                     </Button>
                  )}
               </DialogFooter>
            </DialogContent>
         </Dialog>
      </>
   );
};
