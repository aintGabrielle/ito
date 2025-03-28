import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn("rounded-md animate-pulse bg-primary/25", className)}
      {...props}
    />
  );
}

export { Skeleton };
