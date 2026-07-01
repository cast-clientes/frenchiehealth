import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  className?: string;
  children: ReactNode;
}

export function Card({ className, children }: CardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-2xl border border-[var(--brown-100)] shadow-sm p-5",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className,
  children,
}: CardProps) {
  return (
    <div className={cn("mb-4", className)}>
      {children}
    </div>
  );
}

export function CardTitle({
  className,
  children,
}: CardProps) {
  return (
    <h2
      className={cn(
        "text-lg font-semibold text-[var(--brown-800)]",
        className
      )}
    >
      {children}
    </h2>
  );
}
