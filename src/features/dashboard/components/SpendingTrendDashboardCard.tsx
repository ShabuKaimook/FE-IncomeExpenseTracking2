import { Link } from "@tanstack/react-router";
import { Activity } from "lucide-react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import type { GetUserTransactionSummaryResponse } from "@/features/transactions/api/TransactionResponse";
import { useUserExpenseSummary } from "@/features/transactions/hooks/useUserExpenseSummary";
import { BarChart } from "@/shared/charts/BarChart";
import { DashboardCard } from "@/shared/components/DashboardCard";
import { ChartTheme } from "@/shared/constants/ChartThemeEnum";
import { PERIOD_MODE } from "@/shared/constants/Period";
import { MOCK_USER_ID } from "@/shared/constants/User";
import { getThisMonthRange } from "@/shared/utils/Month";

export const SpendingTrendDashboardCard = () => {
	const thisMonthRange = getThisMonthRange();

	const {
		error: expenseSummaryError,
		expenseSummary,
		isLoading: isExpenseSummaryLoading,
	} = useUserExpenseSummary({
		user_id: MOCK_USER_ID,
		period_mode: PERIOD_MODE.MONTH,
		periods: [
			{
				start_date: thisMonthRange.startDate,
				end_date: thisMonthRange.endDate,
			},
		],
	});

	useEffect(() => {
		if (expenseSummaryError) {
			toast.error("Failed to fetch expense summary. Please try again later.");
		}
	}, [expenseSummaryError]);

	return (
		<DashboardCard
			header={{
				icon: <Activity size={16} className="text-primary" />,
				title: "SPENDING TREND",
			}}
			rightSide={
				<div className="flex items-center gap-2 text-xs lg:text-sm bg-primary/20 px-3 py-1 rounded-2xl">
					{/* TODO: link the path */}
					<Link to="/analytic" className="text-primary cursor-pointer">
						<span className="text-primary cursor-pointer truncate">
							View More
						</span>
					</Link>
				</div>
			}
		>
			<BarChart
				data={
					isExpenseSummaryLoading
						? []
						: expenseSummary?.map(
								(item: GetUserTransactionSummaryResponse, index) => ({
									week: `Week ${index + 1}`,
									expense: item.total_amount,
								}),
							) || []
				}
				xKey="week"
				bars={[
					{
						dataKey: "expense",
						name: "Expense",
						color: ChartTheme.destructive.color,
						gradient: true,
					},
				]}
				height={200}
				showYAxis={true}
			/>
		</DashboardCard>
	);
};
