import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
	IncomeExpenseAnalyticsCard,
	type IncomeExpenseView,
} from "@/features/analytics/components/IncomeExpenseAnalyticsCard";
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
	const periodMode = getPeriodMode(dateRange.mode);

	useEffect(() => {
		if (balanceSummaryError) {
			toast.error("Unable to load analytics data.", {
				toastId: "analytics-load-error",
			});
		}
	}, [balanceSummaryError]);

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

			<section className="flex w-full flex-col gap-4 lg:flex-row">
				<NetBalanceDashboardCard
					netBalance={balanceSummary.net_balance}
					currency={currency}
					isLoading={isBalanceSummaryLoading}
				/>

				<IncomeExpenseAnalyticsCard
					view={incomeExpenseView}
					onViewChange={setIncomeExpenseView}
					incomeTotal={balanceSummary.income}
					expenseTotal={balanceSummary.expense}
					isIncomeLoading={isBalanceSummaryLoading}
					isExpenseLoading={isBalanceSummaryLoading}
					currency={currency}
				/>

				<SavingRateDashboardCard
					period={{
						startDate: dateRange.startDate ?? initialRange.startDate,
						endDate: dateRange.endDate ?? initialRange.endDate,
					}}
					trendLabel={`from previous ${periodMode}`}
					previousPeriod={
						previousRange
							? {
									startDate: previousRange.startDate,
									endDate: previousRange.endDate,
								}
							: undefined
					}
				/>
			</section>
		</div>
	);
}
