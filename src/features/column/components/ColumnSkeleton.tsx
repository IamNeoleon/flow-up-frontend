import { Skeleton } from "@/shared/ui/shadcn/skeleton";

export const ColumnSkeleton = () => {
   return (
      <div className="w-[300px] p-4 rounded-lg border flex flex-col gap-4">
         {/* Заголовок колонки */}
         <Skeleton className="h-6 w-3/4 rounded bg-neutral-700/70" />
         {/* Список задач */}
         <div className="flex flex-col gap-2 mt-2">
            <Skeleton className="animate-pulse h-12 w-full rounded-md bg-neutral-700/70" />
            <Skeleton className="animate-pulse h-12 w-full rounded-md bg-neutral-700/70" />
            <Skeleton className="animate-pulse h-12 w-full rounded-md bg-neutral-700/70" />
            <Skeleton className="animate-pulse h-12 w-full rounded-md bg-neutral-700/70" />
            <Skeleton className="animate-pulse h-12 w-full rounded-md bg-neutral-700/70" />
         </div>

      </div>
   );
};
