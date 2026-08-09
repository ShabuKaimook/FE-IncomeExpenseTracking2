import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { CategoryMixPieCard } from "@/features/analytics/components/CategoryMixPieCard";
import { CategoryTrendCard } from "@/features/analytics/components/CategoryTrendCard";
import {
	IncomeExpenseAnalyticsCard,
	type IncomeExpenseView,
} from "@/features/analytics/components/IncomeExpenseAnalyticsCard";
import { IncomeExpenseTrendCard } from "@/features/analytics/components/IncomeExpenseTrendCard";
import { TopCategoriesCard } from "@/features/analytics/components/TopCategoriesCard";
import {
	getCustomTrendPeriodMode,
	getCustomTrendPeriods,
	getLatestTrendPeriods,
	type TrendMode,
} from "@/features/analytics/utils/trendPeriods";
import NetBalanceDashboardCard from "@/features/dashboard/components/NetBalanceDashboardCard";
import { SavingRateDashboardCard } from "@/features/dashboard/components/SavingRateDashboardCard";
import type { TransactionSummaryPeriodMode } from "@/features/transactions/api/TransactionRequest";
import { useTransactionBalanceSummary } from "@/features/transactions/hooks/useTransactionBalanceSummary";
import { useUserTransactionCategories } from "@/features/userTransactionCategories/hooks/useUserTransactionCategories";
import { useUserTransactionCategorySummary } from "@/features/userTransactionCategories/hooks/useUserTransactionCategorySummary";
import CustomSegmentedControl, {
	type CustomSegmentedControlOption,
} from "@/shared/components/CustomSegmentedControl";
import {
	type DatePickerRange,
	DateRangeWithShowDisabledNavigation,
} from "@/shared/components/DatePicker";
import { TRANSACTION_TYPE } from "@/shared/constants/TransactionTypeEnum";
import { dateToString, getMonthDateRange } from "@/shared/utils/date";

const analysisRangeOptions: readonly CustomSegmentedControlOption<TrendMode>[] =
	[
		{ label: "7D", value: "day" },
		{ label: "4W", value: "week" },
		{ label: "12M", value: "month" },
		{ label: "Custom", value: "custom" },
	] as const;

function getPreviousRange(startDate: Date | null, endDate: Date | null) {
	if (!startDate || !endDate) {
		return null;
	}

	const duration = endDate.getTime() - startDate.getTime();
	const previousEndDate = new Date(startDate.getTime() - 1);
	const previousStartDate = new Date(previousEndDate.getTime() - duration);

	return { startDate: previousStartDate, endDate: previousEndDate };
}

function getPeriodMode(mode: TrendMode): TransactionSummaryPeriodMode {
	if (mode === "week") {
		return "week";
	}

	if (mode === "month") {
		return "month";
	}

	return "day";
}

function getTrendLabel(mode: TrendMode) {
	if (mode === "custom") {
		return "from previous custom range";
	}

	if (mode === "day") {
		return "from previous 7 days";
	}

	if (mode === "week") {
		return "from previous 4 weeks";
	}

	return "from previous 12 months";
}

export default function AnalyticsPage() {
	const initialRange = getMonthDateRange(new Date());
	const [incomeExpenseView, setIncomeExpenseView] =
		useState<IncomeExpenseView>("cards");
	const [trendMode, setTrendMode] = useState<TrendMode>("day");
	const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
		null,
	);
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
	const customTrendPeriodMode = getCustomTrendPeriodMode(
		customTrendRange.startDate,
		customTrendRange.endDate,
	);

	const balanceSummaryRequest = useMemo(
		() => ({
			period_mode: getPeriodMode(trendMode),
			periods: [
				{
					start_date: dateToString(
						trendPeriods.at(0)?.startDate ?? initialRange.startDate,
					),
					end_date: dateToString(
						trendPeriods.at(-1)?.endDate ?? initialRange.endDate,
					),
				},
			],
		}),
		[initialRange.endDate, initialRange.startDate, trendMode, trendPeriods],
	);
	const summaryStartDate =
		trendPeriods.at(0)?.startDate ?? initialRange.startDate;
	const summaryEndDate = trendPeriods.at(-1)?.endDate ?? initialRange.endDate;
	const datePickerRangeValue = useMemo<DatePickerRange>(
		() =>
			trendMode === "custom"
				? customTrendRange
				: {
						mode: "custom",
						startDate: summaryStartDate,
						endDate: summaryEndDate,
					},
		[customTrendRange, summaryEndDate, summaryStartDate, trendMode],
	);
	const previousRange = useMemo(
		() => getPreviousRange(summaryStartDate, summaryEndDate),
		[summaryEndDate, summaryStartDate],
	);
	const categorySummaryRequest = useMemo(
		() => ({
			periods: [
				{
					start_date: summaryStartDate,
					end_date: summaryEndDate,
				},
			],
		}),
		[summaryEndDate, summaryStartDate],
	);
	const previousCategorySummaryRequest = useMemo(
		() => ({
			periods: previousRange
				? [
						{
							start_date: previousRange.startDate,
							end_date: previousRange.endDate,
						},
					]
				: [],
		}),
		[previousRange],
	);
	const incomeCategoryMixSummaryRequest = useMemo(
		() => ({
			periods: [
				{
					start_date: summaryStartDate,
					end_date: summaryEndDate,
				},
			],
			criteria: {
				transaction_type_ids: [TRANSACTION_TYPE.INCOME.id],
			},
		}),
		[summaryEndDate, summaryStartDate],
	);
	const expenseCategoryMixSummaryRequest = useMemo(
		() => ({
			periods: [
				{
					start_date: summaryStartDate,
					end_date: summaryEndDate,
				},
			],
			criteria: {
				transaction_type_ids: [TRANSACTION_TYPE.EXPENSE.id],
			},
		}),
		[summaryEndDate, summaryStartDate],
	);

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
		period_mode: trendMode === "custom" ? customTrendPeriodMode : trendMode,
		periods: trendPeriods.map((period) => ({
			start_date: dateToString(period.startDate),
			end_date: dateToString(period.endDate),
		})),
	});
	const {
		summary: categorySummaries,
		error: categorySummaryError,
		isLoading: isCategorySummaryLoading,
	} = useUserTransactionCategorySummary(categorySummaryRequest);
	const {
		categories: userCategories,
		error: userCategoriesError,
		isLoading: isUserCategoriesLoading,
	} = useUserTransactionCategories();
	const {
		summary: previousCategorySummaries,
		error: previousCategorySummaryError,
		isLoading: isPreviousCategorySummaryLoading,
	} = useUserTransactionCategorySummary(previousCategorySummaryRequest);
	const {
		summary: incomeCategoryMixSummaries,
		error: incomeCategoryMixSummaryError,
		isLoading: isIncomeCategoryMixSummaryLoading,
	} = useUserTransactionCategorySummary(incomeCategoryMixSummaryRequest);
	const {
		summary: expenseCategoryMixSummaries,
		error: expenseCategoryMixSummaryError,
		isLoading: isExpenseCategoryMixSummaryLoading,
	} = useUserTransactionCategorySummary(expenseCategoryMixSummaryRequest);
	useEffect(() => {
		if (
			balanceSummaryError ||
			trendError ||
			categorySummaryError ||
			userCategoriesError ||
			previousCategorySummaryError ||
			incomeCategoryMixSummaryError ||
			expenseCategoryMixSummaryError
		) {
			toast.error("Unable to load analytics data.", {
				toastId: "analytics-load-error",
			});
		}
	}, [
		balanceSummaryError,
		categorySummaryError,
		expenseCategoryMixSummaryError,
		incomeCategoryMixSummaryError,
		previousCategorySummaryError,
		trendError,
		userCategoriesError,
	]);
	useEffect(() => {
		if (selectedCategoryId) {
			return;
		}

		const topCategory = [...categorySummaries].sort(
			(left, right) => right.amount - left.amount,
		)[0];
		setSelectedCategoryId(
			topCategory?.user_transaction_category_id ??
				userCategories[0]?.user_transaction_category_id ??
				null,
		);
	}, [categorySummaries, selectedCategoryId, userCategories]);

	useEffect(() => {
		if (
			!selectedCategoryId ||
			userCategories.some(
				(category) =>
					category.user_transaction_category_id === selectedCategoryId,
			)
		) {
			return;
		}

		setSelectedCategoryId(
			[...categorySummaries].sort(
				(left, right) => right.amount - left.amount,
			)[0]?.user_transaction_category_id ??
				userCategories[0]?.user_transaction_category_id ??
				null,
		);
	}, [categorySummaries, selectedCategoryId, userCategories]);

	const currency = "THB";

	return (
		<div className="flex flex-col gap-4">
			<section>
				<div className="flex w-full flex-col gap-1">
					<div className="flex w-full flex-col gap-2 md:flex-row md:items-center">
						<CustomSegmentedControl
							ariaLabel="Analysis range"
							value={trendMode}
							options={analysisRangeOptions}
							onValueChange={setTrendMode}
							className="h-9! w-full md:flex-1 lg:w-auto lg:flex-none"
						/>
						<div className="flex w-full min-w-0 items-center gap-2 md:flex-1 lg:w-60 lg:flex-none">
							<DateRangeWithShowDisabledNavigation
								mode="custom"
								value={customTrendDate}
								rangeValue={datePickerRangeValue}
								onChange={setCustomTrendDate}
								onRangeChange={(range) => {
									setTrendMode("custom");
									setCustomTrendRange(range);
								}}
								className="h-9! w-full sm:w-full"
								canSelectMultipleMonths
							/>
						</div>
					</div>
				</div>
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
							startDate: summaryStartDate,
							endDate: summaryEndDate,
						}}
						trendLabel={getTrendLabel(trendMode)}
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
				periods={trendPeriods}
				summaries={trendSummaries}
				isLoading={isTrendLoading}
			/>

			<section className="grid w-full grid-cols-1 items-stretch gap-4 lg:grid-cols-2 *:h-full">
				<TopCategoriesCard
					categories={categorySummaries}
					previousCategories={previousCategorySummaries}
					selectedCategoryId={selectedCategoryId}
					isLoading={
						isCategorySummaryLoading || isPreviousCategorySummaryLoading
					}
					onSelectCategory={(category) =>
						setSelectedCategoryId(category.user_transaction_category_id)
					}
				/>
				<CategoryTrendCard
					categoryId={selectedCategoryId}
					categories={userCategories}
					periods={trendPeriods}
					isLoading={isUserCategoriesLoading}
					onSelectCategory={(category) =>
						setSelectedCategoryId(category.user_transaction_category_id)
					}
				/>
			</section>

			<section className="grid w-full grid-cols-1 items-start gap-4 sm:grid-cols-2 *:h-full">
				<CategoryMixPieCard
					categories={incomeCategoryMixSummaries}
					transactionTypeId={TRANSACTION_TYPE.INCOME.id}
					isLoading={isIncomeCategoryMixSummaryLoading}
				/>
				<CategoryMixPieCard
					categories={expenseCategoryMixSummaries}
					transactionTypeId={TRANSACTION_TYPE.EXPENSE.id}
					isLoading={isExpenseCategoryMixSummaryLoading}
				/>
			</section>
		</div>
	);
}
