import { cn } from "@/shared/lib";

export function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-neutral-300 animate-pulse rounded-2xl", className)}
      {...props}
    />
  );
}
