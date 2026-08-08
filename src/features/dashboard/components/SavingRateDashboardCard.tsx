import { ChartNoAxesCombined } from "lucide-react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useUserSavingRate } from "@/features/transactions/hooks/useUserSavingRate";
import { DashboardCard } from "@/shared/components/DashboardCard";
import { Skeleton } from "@/shared/components/Skeleton";
import {
	getCurrentMonthDateRange,
	getPreviousMonthDateRange,
} from "@/shared/utils/date";

interface DateRange {
	startDate: Date;
	endDate: Date;
}

interface SavingRateDashboardCardProps {
	period?: DateRange;
	previousPeriod?: DateRange;
	trendLabel?: string;
}

export const SavingRateDashboardCard = ({
	period,
	previousPeriod,
	trendLabel = "from last month",
}: SavingRateDashboardCardProps) => {
	const thisMonthRange = period ?? getCurrentMonthDateRange();
	const lastMonthRange = previousPeriod ?? getPreviousMonthDateRange();

	const {
		savingRate,
		isLoading: isThisLoading,
		error: thisMonthError,
	} = useUserSavingRate({
		periods: [
			{
				start_date: thisMonthRange.startDate,
				end_date: thisMonthRange.endDate,
			},
		],
	});

	const {
		savingRate: lastMonthSavingRate,
		isLoading: isLastMonthLoading,
		error: lastMonthError,
	} = useUserSavingRate({
		periods: [
			{
				start_date: lastMonthRange.startDate,
				end_date: lastMonthRange.endDate,
			},
		],
	});

	useEffect(() => {
		if (thisMonthError || lastMonthError) {
			toast.error("Failed to fetch saving rate. Please try again later.");
		}
	}, [thisMonthError, lastMonthError]);

	return (
		<DashboardCard
			header={{
				icon: <ChartNoAxesCombined size={16} className="text-primary" />,
				title: "SAVING",
			}}
			bottomSide={
				<div className="mt-2 flex w-full items-center justify-between border-t pt-3 text-xs text-muted-foreground lg:text-sm">
					{isThisLoading || isLastMonthLoading ? (
						<Skeleton className="h-4 w-36" label="Loading saving trend" />
					) : (
						<span>{`${(savingRate - lastMonthSavingRate).toFixed(2)}% ${trendLabel}`}</span>
					)}
				</div>
			}
		>
			<span className="text-2xl font-bold text-primary lg:text-4xl">
				{isThisLoading || isLastMonthLoading ? (
					<Skeleton
						className="h-10 w-28 rounded-lg"
						label="Loading saving total"
					/>
				) : (
					`${savingRate.toFixed(2)}%`
				)}
			</span>
		</DashboardCard>
	);
};
