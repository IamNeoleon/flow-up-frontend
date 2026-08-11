import { Skeleton } from '@/shared/ui/shadcn/skeleton';

export const TableSkeleton = () => {
    return (
        <div>
            <div className="mb-2 flex items-center gap-5">
                <Skeleton className="h-9 flex-1" />
                <Skeleton className="h-9 w-32" />
            </div>

            <div className="rounded-md border">
                <div className="flex h-10 items-center justify-between gap-4 border-b px-4">
                    <Skeleton className="h-4 w-[30%]" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                </div>

                {Array.from({ length: 5 }).map((_, index) => (
                    <div
                        key={index}
                        className="flex h-14 items-center justify-between border-b px-4 last:border-0"
                    >
                        <Skeleton className="h-4 w-[30%]" />
                        <Skeleton className="h-6 w-24 rounded-full" />
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-6 w-20 rounded-full" />
                    </div>
                ))}
            </div>
        </div>
    );
};
