export function getExtFromName(name?: string): string | null {
   if (!name) return null;
   const clean = name.split('?')[0].split('#')[0];
   const dot = clean.lastIndexOf('.');
   if (dot === -1) return null;
   return clean.slice(dot + 1).toLowerCase();
}
