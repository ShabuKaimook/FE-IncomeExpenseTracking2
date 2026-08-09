import { ChartColumnBig } from "lucide-react";
import {
	getCompactMonthPeriodLabel,
	getPeriodKey,
	isMonthPeriod,
	type TrendMode,
	type TrendPeriod,
} from "@/features/analytics/utils/trendPeriods";
import type { GetTransactionBalanceSummaryResponse } from "@/features/transactions/api/TransactionResponse";
import { HorizontalBarChart } from "@/shared/charts/HorizontalBarChart";
import { DashboardCard } from "@/shared/components/DashboardCard";
import { ChartSkeleton } from "@/shared/components/Skeleton";
import { ChartTheme } from "@/shared/constants/ChartThemeEnum";
import { formatMoney, formatNumber } from "@/shared/utils/FormatMoney";

export function IncomeExpenseTrendCard({
	mode,
	periods,
	summaries,
	isLoading,
}: {
	mode: TrendMode;
	periods: TrendPeriod[];
	summaries: GetTransactionBalanceSummaryResponse[];
	isLoading: boolean;
}) {
	const summariesByPeriod = new Map(
		summaries.map((summary) => [
			`${summary.start_date}:${summary.end_date}`,
			summary,
		]),
	);
	const data = periods.map((period, index) => {
		const summary = summariesByPeriod.get(getPeriodKey(period));
		const periodLabel = isMonthPeriod(period)
			? getCompactMonthPeriodLabel(period, periods)
			: period.label;

		return {
			period: mode === "week" ? `Week ${index + 1}` : periodLabel,
			dateRange: period.label,
			income: summary?.income ?? 0,
			expense: summary?.expense ?? 0,
		};
	});
	const hasChartData = data.some(
		(period) => period.income > 0 || period.expense > 0,
	);
	const chartHeight = hasChartData ? Math.max(280, data.length * 52) : 200;

	return (
		<DashboardCard
			header={{
				icon: <ChartColumnBig size={16} className="text-primary" />,
				title: "INCOME VS EXPENSE",
			}}
		>
			{isLoading ? (
				<ChartSkeleton height={chartHeight} />
			) : (
				<HorizontalBarChart
					data={hasChartData ? data : []}
					yKey="period"
					bars={[
						{
							dataKey: "income",
							name: "Income",
							color: ChartTheme.primary.color,
							gradient: true,
						},
						{
							dataKey: "expense",
							name: "Expense",
							color: ChartTheme.destructive.color,
							gradient: true,
						},
					]}
					height={chartHeight}
					barSize={16}
					valueFormatter={(value) => formatMoney(value, "THB")}
					tooltipValueFormatter={formatNumber}
					tooltipLabelFormatter={(label, payload) => {
						const dateRange = (
							payload[0] as { payload?: { dateRange?: string } }
						)?.payload?.dateRange;

						return dateRange ? `${label}: ${dateRange}` : String(label);
					}}
					legendVerticalAlign="bottom"
				/>
			)}
		</DashboardCard>
	);
}
