import { CalendarDays, ChartColumnBig } from "lucide-react";
import {
	getPeriodKey,
	getTrendDescription,
	type TrendMode,
	type TrendPeriod,
} from "@/features/analytics/utils/trendPeriods";
import type { GetTransactionBalanceSummaryResponse } from "@/features/transactions/api/TransactionResponse";
import { BarChart } from "@/shared/charts/BarChart";
import CustomSegmentedControl, {
	type CustomSegmentedControlOption,
} from "@/shared/components/CustomSegmentedControl";
import { DashboardCard } from "@/shared/components/DashboardCard";
import {
	type DatePickerRange,
	DateRangeWithShowDisabledNavigation,
} from "@/shared/components/DatePicker";
import { ChartSkeleton } from "@/shared/components/Skeleton";
import { ChartTheme } from "@/shared/constants/ChartThemeEnum";
import { formatMoney, formatNumber } from "@/shared/utils/FormatMoney";

const trendModeOptions: readonly CustomSegmentedControlOption<TrendMode>[] = [
	{ label: "7D", value: "day" },
	{ label: "4W", value: "week" },
	{ label: "12M", value: "month" },
] as const;

export function IncomeExpenseTrendCard({
	mode,
	onModeChange,
	periods,
	summaries,
	isLoading,
	customDate,
	onCustomDateChange,
	onCustomRangeChange,
}: {
	mode: TrendMode;
	onModeChange: (mode: TrendMode) => void;
	periods: TrendPeriod[];
	summaries: GetTransactionBalanceSummaryResponse[];
	isLoading: boolean;
	customDate: Date | null;
	onCustomDateChange: (date: Date | null) => void;
	onCustomRangeChange: (range: DatePickerRange) => void;
}) {
	const summariesByPeriod = new Map(
		summaries.map((summary) => [
			`${summary.start_date}:${summary.end_date}`,
			summary,
		]),
	);
	const data = periods.map((period) => {
		const summary = summariesByPeriod.get(getPeriodKey(period));

		return {
			period: period.label,
			income: summary?.income ?? 0,
			expense: summary?.expense ?? 0,
		};
	});

	return (
		<DashboardCard
			header={{
				icon: <ChartColumnBig size={16} className="text-primary" />,
				title: "INCOME VS EXPENSE",
			}}
			rightSide={
				<div className="flex items-center gap-2">
					<CustomSegmentedControl
						ariaLabel="Income expense trend period"
						value={mode}
						options={trendModeOptions}
						onValueChange={onModeChange}
						className="h-9!"
					/>
					<DateRangeWithShowDisabledNavigation
						mode="custom"
						value={customDate}
						onChange={onCustomDateChange}
						onRangeChange={(range) => {
							onModeChange("custom");
							onCustomRangeChange(range);
						}}
						className={`h-9! w-9! justify-center px-0! sm:w-9! ${
							mode === "custom"
								? "bg-primary! text-primary-foreground hover:bg-primary/90!"
								: ""
						}`}
						hideTriggerLabel
						triggerIcon={
							<CalendarDays
								size={17}
								className={
									mode === "custom" ? "text-primary-foreground" : "text-primary"
								}
							/>
						}
					/>
				</div>
			}
		>
			<p className="text-xs text-muted-foreground lg:text-sm">
				{getTrendDescription(mode, periods)}
			</p>
			{isLoading ? (
				<ChartSkeleton height={280} />
			) : (
				<BarChart
					data={data}
					xKey="period"
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
					height={280}
					showGrid
					showLabels
					showYAxis
					valueFormatter={(value) => formatMoney(value, "THB")}
					tooltipValueFormatter={formatNumber}
					legendVerticalAlign="bottom"
				/>
			)}
		</DashboardCard>
	);
}
