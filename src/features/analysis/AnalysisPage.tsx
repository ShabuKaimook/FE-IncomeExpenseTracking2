import { Link } from "@tanstack/react-router";
import {
	AlertTriangle,
	CalendarDays,
	ReceiptText,
	Repeat2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { BarChart } from "@/shared/charts/BarChart";
import { PieChart } from "@/shared/charts/PieChart";
import CustomSegmentedControl from "@/shared/components/CustomSegmentedControl";
import { DashboardCard } from "@/shared/components/DashboardCard";
import { TRANSACTION_TYPE } from "@/shared/constants/TransactionTypeEnum";
import { formatMoney } from "@/shared/utils/FormatMoney";
import { useUserExpenseTotal } from "../transactions/hooks/useUserExpenseTotal";
import { useUserIncomeTotal } from "../transactions/hooks/useUserIncomeTotal";
import { useUserTransactions } from "../transactions/hooks/useUserTransactions";
import { useUserTransactionCategoryAmounts } from "../userTransactionCategories/hooks/useUserTransactionCategoryAmounts";
import { useAnalysisMetrics } from "./hooks/useAnalysisMetrics";

type PeriodMode = "week" | "month" | "year";

const periodOptions = [
	{ label: "Week", value: "week" },
	{ label: "Month", value: "month" },
	{ label: "Year", value: "year" },
] as const;

const dateToString = (date: Date) =>
	`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
		date.getDate(),
	).padStart(2, "0")}`;

const getPeriodRange = (mode: PeriodMode, selectedDate: Date) => {
	if (mode === "year") {
		const year = selectedDate.getFullYear();
		return {
			endDate: new Date(year, 11, 31, 23, 59, 59, 999),
			startDate: new Date(year, 0, 1),
		};
	}

	if (mode === "month") {
		const year = selectedDate.getFullYear();
		const month = selectedDate.getMonth();
		return {
			endDate: new Date(year, month + 1, 0, 23, 59, 59, 999),
			startDate: new Date(year, month, 1),
		};
	}

	const day = selectedDate.getDay();
	const startDate = new Date(selectedDate);
	startDate.setDate(selectedDate.getDate() - (day === 0 ? 6 : day - 1));
	startDate.setHours(0, 0, 0, 0);

	const endDate = new Date(startDate);
	endDate.setDate(startDate.getDate() + 6);
	endDate.setHours(23, 59, 59, 999);

	return { endDate, startDate };
};

function SummaryCards({
	expenseTotal,
	incomeTotal,
	isLoading,
}: {
	expenseTotal: number;
	incomeTotal: number;
	isLoading: boolean;
}) {
	return (
		<div className="grid gap-3 md:grid-cols-3">
			<DashboardCard header={{ title: "Income" }}>
				<p className="text-2xl font-semibold text-foreground">
					{isLoading ? "Loading..." : formatMoney(incomeTotal, "THB")}
				</p>
			</DashboardCard>
			<DashboardCard header={{ title: "Expense" }}>
				<p className="text-2xl font-semibold text-foreground">
					{isLoading ? "Loading..." : formatMoney(expenseTotal, "THB")}
				</p>
			</DashboardCard>
			<DashboardCard header={{ title: "Balance" }}>
				<p className="text-2xl font-semibold text-foreground">
					{isLoading
						? "Loading..."
						: formatMoney(incomeTotal - expenseTotal, "THB")}
				</p>
			</DashboardCard>
		</div>
	);
}

function IncomeExpenseRatio({
	expenseTotal,
	incomeTotal,
}: {
	expenseTotal: number;
	incomeTotal: number;
}) {
	const total = incomeTotal + expenseTotal;

	return (
		<DashboardCard header={{ title: "Income vs Expense" }}>
			<PieChart
				data={[
					{ name: "Income", value: incomeTotal },
					{ name: "Expense", value: expenseTotal },
				].filter((item) => item.value > 0)}
				colors={["oklch(62% 0.16 150)", "oklch(62% 0.18 28)"]}
				height={190}
				innerRadius={44}
				outerRadius={68}
			/>
			<p className="text-sm text-muted-foreground">
				Expense is {total > 0 ? Math.round((expenseTotal / total) * 100) : 0}%
				of tracked cash flow.
			</p>
		</DashboardCard>
	);
}

function CategoryPieChart({
	categories,
}: {
	categories: { amount: number; user_transaction_category_name: string }[];
}) {
	return (
		<DashboardCard header={{ title: "Category Breakdown" }}>
			<PieChart
				data={categories.map((category) => ({
					name: category.user_transaction_category_name,
					value: category.amount,
				}))}
				height={220}
				innerRadius={54}
				outerRadius={78}
				maxLegendItems={6}
			/>
		</DashboardCard>
	);
}

function CategoryTrendChart({
	trend,
}: {
	trend: {
		month: string;
		total_amount: number;
		transaction_category_name: string;
	}[];
}) {
	const title = trend[0]?.transaction_category_name
		? `${trend[0].transaction_category_name} Trend`
		: "Category Trend";

	return (
		<DashboardCard header={{ title }}>
			<BarChart
				data={trend.map((item) => ({
					amount: item.total_amount,
					month: item.month,
				}))}
				xKey="month"
				bars={[{ color: "var(--primary)", dataKey: "amount", name: "Amount" }]}
				height={220}
				showYAxis
			/>
		</DashboardCard>
	);
}

function AverageTransactionSizeCard({
	averages,
}: {
	averages: {
		avg_amount: number;
		transaction_category_name: string;
		transaction_count: number;
	}[];
}) {
	return (
		<DashboardCard header={{ title: "Average Transaction Size" }}>
			<div className="w-full divide-y divide-(--line)">
				{averages.length === 0 ? (
					<p className="py-6 text-sm text-muted-foreground">
						No average data in this period.
					</p>
				) : (
					averages.slice(0, 6).map((item) => (
						<div
							key={item.transaction_category_name}
							className="grid grid-cols-[1fr_auto] gap-3 py-2 text-sm"
						>
							<div className="min-w-0">
								<p className="truncate font-medium text-foreground">
									{item.transaction_category_name}
								</p>
								<p className="text-xs text-muted-foreground">
									{item.transaction_count} transactions
								</p>
							</div>
							<span className="font-semibold text-foreground">
								{formatMoney(item.avg_amount, "THB")}
							</span>
						</div>
					))
				)}
			</div>
		</DashboardCard>
	);
}

const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const formatCompactMoney = (amount: number) =>
	new Intl.NumberFormat("en", {
		compactDisplay: "short",
		maximumFractionDigits: 1,
		notation: "compact",
		style: "currency",
		currency: "THB",
	}).format(amount);

function SpendingHeatmapCard({
	heatmap,
}: {
	heatmap: { day_of_week: number; total_spent: number }[];
}) {
	const totals = dayLabels.map((_, day) =>
		heatmap
			.filter((item) => item.day_of_week === day)
			.reduce((sum, item) => sum + item.total_spent, 0),
	);
	const max = Math.max(...totals, 0);

	return (
		<DashboardCard
			header={{
				icon: <CalendarDays size={16} className="text-primary" />,
				title: "Spending Heatmap",
			}}
		>
			<div className="grid w-full grid-cols-7 gap-2">
				{dayLabels.map((label, index) => {
					const intensity = max > 0 ? totals[index] / max : 0;

					return (
						<div key={label} className="min-w-0 text-center">
							<div className="mb-1 truncate text-xs text-muted-foreground">
								{label}
							</div>
							<div
								className="flex aspect-square items-center justify-center rounded-lg border border-(--line) px-1 text-[10px] font-medium text-foreground sm:text-xs"
								style={{
									backgroundColor: `oklch(68% 0.16 32 / ${0.1 + intensity * 0.75})`,
								}}
							>
								{totals[index] > 0 ? formatCompactMoney(totals[index]) : "-"}
							</div>
						</div>
					);
				})}
			</div>
		</DashboardCard>
	);
}

function FixedVsVariableCard({
	fixedAmount,
	variableAmount,
}: {
	fixedAmount: number;
	variableAmount: number;
}) {
	return (
		<DashboardCard header={{ title: "Fixed vs Variable" }}>
			<PieChart
				data={[
					{ name: "Fixed", value: fixedAmount },
					{ name: "Variable", value: variableAmount },
				].filter((item) => item.value > 0)}
				colors={["oklch(62% 0.16 250)", "oklch(62% 0.18 28)"]}
				height={190}
				innerRadius={44}
				outerRadius={68}
			/>
		</DashboardCard>
	);
}

function TopTransactionsList({
	transactions,
}: {
	transactions: {
		amount: number;
		currency_code: string;
		description: string;
	}[];
}) {
	return (
		<DashboardCard
			header={{
				icon: <ReceiptText size={16} className="text-primary" />,
				title: "Top Transactions",
			}}
			rightSide={
				<Link className="text-sm text-primary" to="/transaction">
					View all
				</Link>
			}
		>
			<div className="w-full divide-y divide-(--line)">
				{transactions.length === 0 ? (
					<p className="py-6 text-sm text-muted-foreground">
						No transactions in this period.
					</p>
				) : (
					transactions.map((transaction) => (
						<div
							key={`${transaction.description}-${transaction.amount}`}
							className="flex items-center justify-between gap-3 py-2 text-sm"
						>
							<span className="min-w-0 truncate text-foreground">
								{transaction.description}
							</span>
							<span className="shrink-0 font-medium text-foreground">
								{formatMoney(transaction.amount, "THB")}
							</span>
						</div>
					))
				)}
			</div>
		</DashboardCard>
	);
}

function InsightCards({
	expenseTotal,
	incomeTotal,
}: {
	expenseTotal: number;
	incomeTotal: number;
}) {
	const balance = incomeTotal - expenseTotal;
	const savingsRate = incomeTotal > 0 ? (balance / incomeTotal) * 100 : 0;

	return (
		<div className="grid gap-3 md:grid-cols-3">
			<DashboardCard header={{ title: "Savings Rate" }}>
				<p className="text-2xl font-semibold text-foreground">
					{savingsRate.toFixed(1)}%
				</p>
			</DashboardCard>
			<DashboardCard header={{ title: "Forecast" }}>
				<p className="text-sm text-muted-foreground">
					At this pace, balance ends near {formatMoney(balance, "THB")}.
				</p>
			</DashboardCard>
			<DashboardCard
				header={{
					icon: <AlertTriangle size={16} className="text-primary" />,
					title: "Alerts",
				}}
			>
				<p className="text-sm text-muted-foreground">
					{expenseTotal > incomeTotal
						? "Expense is higher than income for this range."
						: "No anomaly detected from available totals."}
				</p>
			</DashboardCard>
		</div>
	);
}

function RecurringTransactionsList({
	recurringTransactions,
}: {
	recurringTransactions: {
		amount: number;
		description: string;
		interval_days: number;
		last_seen: string;
	}[];
}) {
	return (
		<DashboardCard
			header={{
				icon: <Repeat2 size={16} className="text-primary" />,
				title: "Recurring Transactions",
			}}
		>
			<div className="w-full divide-y divide-(--line)">
				{recurringTransactions.length === 0 ? (
					<p className="py-6 text-sm text-muted-foreground">
						No recurring transactions found.
					</p>
				) : (
					recurringTransactions.slice(0, 6).map((transaction) => (
						<div
							key={`${transaction.description}-${transaction.amount}-${transaction.last_seen}`}
							className="grid grid-cols-[1fr_auto] gap-3 py-2 text-sm"
						>
							<div className="min-w-0">
								<p className="truncate font-medium text-foreground">
									{transaction.description}
								</p>
								<p className="text-xs text-muted-foreground">
									Every {transaction.interval_days} days &middot; last seen{" "}
									{transaction.last_seen}
								</p>
							</div>
							<span className="font-semibold text-foreground">
								{formatMoney(transaction.amount, "THB")}
							</span>
						</div>
					))
				)}
			</div>
		</DashboardCard>
	);
}

export default function AnalysisPage() {
	const [periodMode, setPeriodMode] = useState<PeriodMode>("month");
	const [selectedDate, setSelectedDate] = useState(() => new Date());
	const range = useMemo(
		() => getPeriodRange(periodMode, selectedDate),
		[periodMode, selectedDate],
	);
	const totalCriteria = useMemo(
		() => ({ end_date: range.endDate, start_date: range.startDate }),
		[range],
	);
	const stringCriteria = useMemo(
		() => ({
			end_date: dateToString(range.endDate),
			start_date: dateToString(range.startDate),
		}),
		[range],
	);
	const { incomeTotal, isLoading: isIncomeLoading } = useUserIncomeTotal({
		criteria: totalCriteria,
	});
	const { expenseTotal, isLoading: isExpenseLoading } = useUserExpenseTotal({
		criteria: totalCriteria,
	});
	const { categories, isLoading: isCategoriesLoading } =
		useUserTransactionCategoryAmounts({
			...stringCriteria,
			order_by: { direction: "desc", field: "amount" },
			transaction_type_id: TRANSACTION_TYPE.EXPENSE.id,
		});
	const { transactions, isLoading: isTransactionsLoading } =
		useUserTransactions({
			criteria: stringCriteria,
			order_by: { direction: "desc", field: "amount" },
			pagination: { limit: 10, page: 0 },
		});
	const topExpenseCategoryIds = useMemo(
		() =>
			categories
				.slice(0, 6)
				.map((category) => category.user_transaction_category_id),
		[categories],
	);
	const {
		averageTransactionSize,
		categoryTrend,
		fixedVsVariable,
		recurringTransactions,
		spendingHeatmap,
	} = useAnalysisMetrics({
		...stringCriteria,
		trend_user_transaction_category_id: topExpenseCategoryIds[0],
		user_transaction_category_ids:
			topExpenseCategoryIds.length > 0 ? topExpenseCategoryIds : undefined,
	});
	const isTotalLoading = isIncomeLoading || isExpenseLoading;

	return (
		<div className="flex flex-col gap-4">
			<section className="flex flex-col gap-3 rounded-xl border border-(--line) bg-popover p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="text-xl font-semibold text-foreground">Analysis</h1>
					<p className="text-sm text-muted-foreground">
						{dateToString(range.startDate)} - {dateToString(range.endDate)}
					</p>
				</div>

				<div className="flex flex-col gap-2 sm:flex-row">
					<CustomSegmentedControl
						ariaLabel="Analysis period"
						value={periodMode}
						options={periodOptions}
						onValueChange={setPeriodMode}
					/>
					<input
						aria-label="Analysis date"
						className="h-10 rounded-lg border border-(--line) bg-popover px-3 text-sm text-foreground transition hover:border-primary/40 focus:outline-primary"
						type="date"
						value={dateToString(selectedDate)}
						onChange={(event) => setSelectedDate(new Date(event.target.value))}
					/>
				</div>
			</section>

			<section className="flex flex-col gap-3">
				<SummaryCards
					expenseTotal={expenseTotal}
					incomeTotal={incomeTotal}
					isLoading={isTotalLoading}
				/>
				<div className="grid gap-3 lg:grid-cols-2">
					<IncomeExpenseRatio
						expenseTotal={expenseTotal}
						incomeTotal={incomeTotal}
					/>
					<CategoryTrendChart trend={categoryTrend} />
				</div>
			</section>

			<section className="grid gap-3 lg:grid-cols-2">
				<CategoryPieChart categories={isCategoriesLoading ? [] : categories} />
				<TopTransactionsList
					transactions={isTransactionsLoading ? [] : transactions}
				/>
			</section>

			<section className="grid gap-3 lg:grid-cols-2">
				<AverageTransactionSizeCard averages={averageTransactionSize} />
				<SpendingHeatmapCard heatmap={spendingHeatmap} />
			</section>

			<section className="grid gap-3 lg:grid-cols-2">
				<FixedVsVariableCard
					fixedAmount={fixedVsVariable.fixed_amount}
					variableAmount={fixedVsVariable.variable_amount}
				/>
				<RecurringTransactionsList
					recurringTransactions={recurringTransactions}
				/>
			</section>

			<section>
				<InsightCards expenseTotal={expenseTotal} incomeTotal={incomeTotal} />
			</section>
		</div>
	);
}
