const ALLOWED_TYPES = [
   "image/jpeg",
   "image/png",
   "image/webp",
   "image/gif",
];

export const isImage = (file: File) => {
   return ALLOWED_TYPES.includes(file.type);
}