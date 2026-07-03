import { DashboardCard } from "#/components/DashboardCard";
import { createFileRoute } from "@tanstack/react-router";
import { Wallet, ChartBarBig, TrendingUp, ChartNoAxesCombined } from "lucide-react";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* Net, Income, Expense, Saving Rate Section */}
      <div className="flex flex-col lg:flex-row gap-4 w-full">
        {/* Net Card */}
        <DashboardCard
          header={{
            icon: <Wallet size={16} className="text-primary" />,
            title: "NET BALANCE",
          }}
          rightSide={
            <div className="flex items-center gap-2 text-xs lg:text-sm bg-primary/20 px-3 py-1 rounded-2xl">
              <span className="text-primary">Positive</span>
            </div>
          }
          children={
            <span className="text-2xl font-bold text-primary lg:text-4xl">
              $ 0.00
            </span>
          }
          bottomSide={
            <div className="mt-2 flex w-full items-center justify-between border-t pt-3 text-xs text-muted-foreground lg:text-sm">
              <span>Last updated: Today</span>
            </div>
          }
        />

        {/* Income/Expense Card */}
        <DashboardCard
          header={{
            icon: <ChartBarBig size={16} className="text-primary" />,
            title: "INCOME & EXPENSE",
          }}

          children={
            <div className="flex gap-4 w-full">
              <DashboardCard
                leftSide={
                  <span className="text-xs text-muted-foreground lg:text-sm">
                    Income
                  </span>
                }
                rightSide={<TrendingUp size={16} className="text-primary" />}
                bgColor="bg-linear-[150deg] from-primary/50 to-primary/10 text-white"

                children={
                  <span className="text-lg font-bold text-muted-foreground lg:text-xl">
                    $ 0.00
                  </span>
                }
              />

              <DashboardCard
                leftSide={
                  <span className="text-xs text-muted-foreground lg:text-sm">
                    Expense
                  </span>
                }
                rightSide={
                  <TrendingUp size={16} className="text-destructive" />
                }
                bgColor="bg-linear-[150deg] from-destructive/50 to-destructive/10 text-white"

                children={
                  <span className="text-lg font-bold text-muted-foreground lg:text-xl">
                    $ 0.00
                  </span>
                }
              />
            </div>
          }
        />

        {/* Saving Card */}
        <DashboardCard 
          header={{
            icon: <ChartNoAxesCombined size={16} className="text-primary" />,
            title: "SAVING",
          }}
          children={
            <span className="text-2xl font-bold text-primary lg:text-4xl">
              $ 0.00
            </span>
          }
          bottomSide={
            <div className="mt-2 flex w-full items-center justify-between border-t pt-3 text-xs text-muted-foreground lg:text-sm">
              <span>+4.1% from last month</span>
            </div>
          }
        />
      </div>
    </div>
  );
}
