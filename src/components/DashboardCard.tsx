import { ReactNode } from "react";

interface DashboardCardProps {
  header?: {
    icon?: ReactNode;
    title: string;
  };

  leftSide?: ReactNode;
  rightSide?: ReactNode;
  bottomSide?: ReactNode;
  children?: ReactNode;
  bgColor?: string;
}

export const DashboardCard = ({
  header,
  leftSide,
  rightSide,
  children,
  bottomSide,
  bgColor = "bg-card",
}: DashboardCardProps) => {
  return (
    <div
      className={`flex flex-col items-start gap-2 rounded-xl border p-4 ${bgColor} w-full`}
    >
      <div className="flex items-center justify-between w-full">
        {/* right side */}
        <div className="flex items-center gap-2">
          {header ? (
            <div className="flex items-center gap-2">
              {header.icon}
              <span className="text-sm text-muted-foreground lg:text-lg">
                {header.title}
              </span>
            </div>
          ) : (
            leftSide
          )}
        </div>

        {/* left side */}
        {rightSide}
      </div>

      {children}
      {bottomSide}
    </div>
  );
};
