import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
	IncomeExpenseAnalyticsCard,
	type IncomeExpenseView,
} from "@/features/analytics/components/IncomeExpenseAnalyticsCard";
import { IncomeExpenseTrendCard } from "@/features/analytics/components/IncomeExpenseTrendCard";
import {
	getCustomTrendPeriods,
	getLatestTrendPeriods,
	type TrendMode,
} from "@/features/analytics/utils/trendPeriods";
import NetBalanceDashboardCard from "@/features/dashboard/components/NetBalanceDashboardCard";
import { SavingRateDashboardCard } from "@/features/dashboard/components/SavingRateDashboardCard";
import type { TransactionSummaryPeriodMode } from "@/features/transactions/api/TransactionRequest";
import { useTransactionBalanceSummary } from "@/features/transactions/hooks/useTransactionBalanceSummary";
import {
	type DatePickerRange,
	DateRangeWithShowDisabledNavigation,
} from "@/shared/components/DatePicker";
import { dateToString, getMonthDateRange } from "@/shared/utils/date";

const analyticsDateModes = [
	{ label: "Day", value: "single" },
	{ label: "Week", value: "week" },
	{ label: "Month", value: "month" },
	{ label: "Custom", value: "custom" },
] as const;

function getPreviousRange(range: DatePickerRange) {
	if (!range.startDate || !range.endDate) {
		return null;
	}

	const duration = range.endDate.getTime() - range.startDate.getTime();
	const previousEndDate = new Date(range.startDate.getTime() - 1);
	const previousStartDate = new Date(previousEndDate.getTime() - duration);

	return { startDate: previousStartDate, endDate: previousEndDate };
}

function getPeriodMode(
	mode: DatePickerRange["mode"],
): TransactionSummaryPeriodMode {
	if (mode === "week") {
		return "week";
	}

	if (mode === "month") {
		return "month";
	}

	return "day";
}

function getTrendLabel(mode: DatePickerRange["mode"]) {
	if (mode === "custom") {
		return "from previous custom range";
	}

	return `from previous ${getPeriodMode(mode)}`;
}

export default function AnalyticsPage() {
	const initialRange = getMonthDateRange(new Date());
	const [selectedDate, setSelectedDate] = useState(initialRange.startDate);
	const [dateRange, setDateRange] = useState<DatePickerRange>({
		mode: "month",
		startDate: initialRange.startDate,
		endDate: initialRange.endDate,
	});
	const [incomeExpenseView, setIncomeExpenseView] =
		useState<IncomeExpenseView>("cards");
	const [trendMode, setTrendMode] = useState<TrendMode>("day");
	const [customTrendDate, setCustomTrendDate] = useState<Date | null>(
		initialRange.startDate,
	);
	const [customTrendRange, setCustomTrendRange] = useState<DatePickerRange>({
		mode: "custom",
		startDate: initialRange.startDate,
		endDate: initialRange.endDate,
	});
	const trendPeriods = useMemo(() => {
		if (trendMode === "custom") {
			return getCustomTrendPeriods(
				customTrendRange.startDate,
				customTrendRange.endDate,
			);
		}

		return getLatestTrendPeriods(trendMode);
	}, [customTrendRange.endDate, customTrendRange.startDate, trendMode]);

	const balanceSummaryRequest = useMemo(
		() => ({
			period_mode: getPeriodMode(dateRange.mode),
			periods: [
				{
					start_date: dateToString(
						dateRange.startDate ?? initialRange.startDate,
					),
					end_date: dateToString(dateRange.endDate ?? initialRange.endDate),
				},
			],
		}),
		[
			dateRange.endDate,
			dateRange.mode,
			dateRange.startDate,
			initialRange.endDate,
			initialRange.startDate,
		],
	);
	const previousRange = useMemo(() => getPreviousRange(dateRange), [dateRange]);

	const {
		balanceSummary,
		error: balanceSummaryError,
		isLoading: isBalanceSummaryLoading,
	} = useTransactionBalanceSummary(balanceSummaryRequest);
	const {
		balanceSummaries: trendSummaries,
		error: trendError,
		isLoading: isTrendLoading,
	} = useTransactionBalanceSummary({
		period_mode: trendMode === "custom" ? "day" : trendMode,
		periods: trendPeriods.map((period) => ({
			start_date: dateToString(period.startDate),
			end_date: dateToString(period.endDate),
		})),
	});
	useEffect(() => {
		if (balanceSummaryError || trendError) {
			toast.error("Unable to load analytics data.", {
				toastId: "analytics-load-error",
			});
		}
	}, [balanceSummaryError, trendError]);

	const currency = "THB";

	return (
		<div className="flex flex-col gap-4">
			<section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<DateRangeWithShowDisabledNavigation
					value={selectedDate}
					onChange={(date) => {
						if (date) {
							setSelectedDate(date);
						}
					}}
					onRangeChange={setDateRange}
					modeOptions={analyticsDateModes}
					className="lg:w-72"
				/>
			</section>

			<section className="grid w-full grid-cols-1 items-stretch gap-4 md:grid-cols-2 lg:grid-cols-3 [&>div>*]:h-full">
				<div className="h-full md:col-span-2 lg:col-span-1">
					<NetBalanceDashboardCard
						netBalance={balanceSummary.net_balance}
						currency={currency}
						isLoading={isBalanceSummaryLoading}
					/>
				</div>

				<div className="h-full md:row-start-2 lg:row-start-auto">
					<IncomeExpenseAnalyticsCard
						view={incomeExpenseView}
						onViewChange={setIncomeExpenseView}
						incomeTotal={balanceSummary.income}
						expenseTotal={balanceSummary.expense}
						isIncomeLoading={isBalanceSummaryLoading}
						isExpenseLoading={isBalanceSummaryLoading}
						currency={currency}
					/>
				</div>

				<div className="h-full md:row-start-2 lg:row-start-auto">
					<SavingRateDashboardCard
						period={{
							startDate: dateRange.startDate ?? initialRange.startDate,
							endDate: dateRange.endDate ?? initialRange.endDate,
						}}
						trendLabel={getTrendLabel(dateRange.mode)}
						previousPeriod={
							previousRange
								? {
										startDate: previousRange.startDate,
										endDate: previousRange.endDate,
									}
								: undefined
						}
					/>
				</div>
			</section>

			<IncomeExpenseTrendCard
				mode={trendMode}
				onModeChange={setTrendMode}
				periods={trendPeriods}
				summaries={trendSummaries}
				isLoading={isTrendLoading}
				customDate={customTrendDate}
				onCustomDateChange={setCustomTrendDate}
				onCustomRangeChange={setCustomTrendRange}
			/>
		</div>
	);
}
