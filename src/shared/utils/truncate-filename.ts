export const truncateFilename = (name: string, max = 28) => {
   const dot = name.lastIndexOf(".");
   if (dot === -1) return name.slice(0, max) + "…";

   const ext = name.slice(dot);
   const base = name.slice(0, dot);

   if (base.length + ext.length <= max) return name;

   return base.slice(0, max - ext.length - 1) + "…" + ext;
};
