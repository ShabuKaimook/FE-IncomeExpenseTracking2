import type { CSSProperties } from "react";

interface SkeletonProps {
  className?: string;
  bg?: string;
  label?: string;
  style?: CSSProperties;
}

export const Skeleton = ({
  className = "",
  bg = "muted",
  label = "Loading content",
  style,
}: SkeletonProps) => {
  return (
    <output
      aria-label={label}
      className={`block animate-pulse rounded-md border border-(var(--line)) bg-${bg} ${className}`}
      style={style}
    >
      <span className="sr-only">{label}</span>
    </output>
  );
};

interface SkeletonTextProps {
  lines?: number;
  className?: string;
}

export const SkeletonText = ({
  lines = 2,
  className = "",
}: SkeletonTextProps) => {
  const lineKeys = Array.from({ length: lines }, (_, index) => `line-${index}`);

  return (
    <div
      className={`flex w-full flex-col gap-2 ${className}`}
      aria-hidden="true"
    >
      {lineKeys.map((itemKey, index) => (
        <Skeleton
          key={itemKey}
          className={index === lines - 1 ? "h-3 w-2/3" : "h-3 w-full"}
        />
      ))}
    </div>
  );
};

interface ChartSkeletonProps {
  height?: number;
  variant?: "bar" | "pie";
}

const barSkeletonItems = [
  { id: "bar-short", height: 45 },
  { id: "bar-tall", height: 72 },
  { id: "bar-mid", height: 58 },
  { id: "bar-peak", height: 84 },
  { id: "bar-end", height: 66 },
];

export const ChartSkeleton = ({
  height = 200,
  variant = "bar",
}: ChartSkeletonProps) => {
  if (variant === "pie") {
    return (
      <output
        aria-label="Loading chart"
        className="flex w-full items-center justify-between"
        style={{ height }}
      >
        <div className="relative flex size-36 items-center justify-center rounded-full border border-(--line) bg-muted">
          <div className="size-20 rounded-full bg-card" />
        </div>
				<div className="flex flex-1 flex-col gap-2 ">
					<Skeleton className="ml-10 h-3 w-3/4" />
					<Skeleton className="ml-10 h-3 w-3/4" />
					<Skeleton className="ml-10 h-3 w-3/4" />
				</div>
        <span className="sr-only">Loading chart</span>
      </output>
    );
  }

  return (
    <output
      aria-label="Loading chart"
      className="flex w-full items-end gap-3 rounded-lg border border-(--line) bg-(--surface) p-4"
      style={{ height }}
    >
      {barSkeletonItems.map((item) => (
        <Skeleton
          key={item.id}
          className="flex-1 rounded-t-lg rounded-b-sm"
          style={{ height: `${item.height}%` }}
        />
      ))}
      <span className="sr-only">Loading chart</span>
    </output>
  );
};

interface TransactionListSkeletonProps {
  items?: number;
}

export const TransactionListSkeleton = ({
  items = 5,
}: TransactionListSkeletonProps) => {
  const itemKeys = Array.from(
    { length: items },
    (_, index) => `transaction-${index}`,
  );

  return (
    <output
      aria-label="Loading transactions"
      className="flex w-full flex-col gap-2"
    >
      {itemKeys.map((itemKey) => (
        <div
          key={itemKey}
          className="flex w-full h-25 items-center justify-between gap-3 rounded-lg border border-(--line) bg-(--surface) px-3 py-3"
        >
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <Skeleton className="size-3 rounded-full" />
                <Skeleton className="h-4 w-1/3" />
              </div>
              <Skeleton className="mt-2 h-3 w-1/4 ml-5" />
            </div>
          </div>
          <Skeleton className="h-5 w-20" />
        </div>
      ))}
    </output>
  );
};
