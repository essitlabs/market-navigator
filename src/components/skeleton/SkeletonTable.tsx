import { Skeleton } from "@/components/ui/skeleton";
const cn = (...classes: Array<string | false | null | undefined>) =>
    classes.filter(Boolean).join(" ");

export default function SkeletonTable() {
    return (
        <div className="w-full space-y-3">


            {/* Table Skeleton */}
            <div className="border rounded-lg overflow-hidden">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex border-b last:border-0">
                        {[...Array(5)].map((_, j) => (
                            <Skeleton
                                key={j}
                                className={cn(
                                    "h-10 w-1/5 p-2 m-2 rounded-sm",
                                    "bg-slate-200 dark:bg-slate-800" // Theme-aware
                                )}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
