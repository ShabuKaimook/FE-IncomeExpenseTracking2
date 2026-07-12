import { LoadingSpinner } from "#/components/LoadingSpinner";
import { ChartNoAxesCombined } from "lucide-react";
import { DashboardCard } from "#/components/DashboardCard";
import { formatMoney } from "#/utils/FormatMoney";

export const SavingRateDashboardCard = ({ currency }: { currency: string }) => {
  const isLoading = false; // TODO: Implement loading state when fetching saving rate data

  return (
    <DashboardCard
          header={{
            icon: <ChartNoAxesCombined size={16} className="text-primary" />,
            title: "SAVING",
          }}
          bottomSide={
            <div className="mt-2 flex w-full items-center justify-between border-t pt-3 text-xs text-muted-foreground lg:text-sm">
              <span>+4.1% from last month</span>
            </div>
          }
        >
          <span className="text-2xl font-bold text-primary lg:text-4xl">
            {isLoading ? (
              <LoadingSpinner size={32} label="Loading saving total" />
            ) : (
              formatMoney(0, currency)
            )}
          </span>
        </DashboardCard>
  )
}
