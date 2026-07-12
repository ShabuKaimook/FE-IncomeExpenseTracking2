import { ChartNoAxesCombined } from "lucide-react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { DashboardCard } from "#/components/DashboardCard";
import { LoadingSpinner } from "#/components/LoadingSpinner";
import { MOCK_USER_ID } from "#/constants/user";
import { useUserSavingRate } from "#/hooks/transactions/useUserSavingRate";
import { getThisMonthRange, getLastMonthRange } from "#/utils/Month";

export const SavingRateDashboardCard = () => {
	const thisMonthRange = getThisMonthRange();
  const lastMonthRange = getLastMonthRange();

	const { savingRate, isLoading: isThisLoading, error: thisMonthError } = useUserSavingRate({
		user_id: MOCK_USER_ID,
		periods: [
			{
				start_date: thisMonthRange.startDate,
				end_date: thisMonthRange.endDate,
			},
		],
	});

  const { savingRate: lastMonthSavingRate, isLoading: isLastMonthLoading, error: lastMonthError } = useUserSavingRate({
    user_id: MOCK_USER_ID,
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
					<span>{`${(savingRate - lastMonthSavingRate).toFixed(2)}% from last month`}</span>
				</div>
			}
		>
			<span className="text-2xl font-bold text-primary lg:text-4xl">
				{isThisLoading || isLastMonthLoading ? (
					<LoadingSpinner size={32} label="Loading saving total" />
				) : `${savingRate.toFixed(2)}%`}
			</span>
		</DashboardCard>
	);
};
