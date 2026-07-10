import { createFileRoute, Link } from "@tanstack/react-router";
import {
	Activity,
	ChartBarBig,
	ChartNoAxesCombined,
	ClockFading,
	TrendingUp,
	Wallet,
	WalletCards,
} from "lucide-react";
import { useMemo } from "react";
import { BarChart } from "#/components/charts/Barchart";
import { PieChart } from "#/components/charts/PieChart";
import { DashboardCard } from "#/components/DashboardCard";
import {
	type Transaction,
	TransactionCard,
} from "#/components/TransactionCard";
import { ChartTheme } from "#/constants/ChartTheme.enum";
import { TRANSACTION_TYPE } from "#/constants/TransactionType.enum";
import { MOCK_USER_ID } from "#/constants/user";
import { useUserExpenseTotal } from "#/hooks/transactions/useUserExpenseTotal";
import { useUserIncomeTotal } from "#/hooks/transactions/useUserIncomeTotal";
import { useUserTransactions } from "#/hooks/transactions/useUserTransactions";
import type { TransactionResponse } from "#/services/TransactionService/types/TransactionResponse";
import { formatMoney } from "#/utils/FormatMoney";
import { getThisMonthRange } from "#/utils/Month";

export const Route = createFileRoute("/")({ component: Home });

const mapTransaction = (transaction: TransactionResponse): Transaction => {
	const isIncome =
		transaction.transaction_type_id === TRANSACTION_TYPE.INCOME.id;

	return {
		id: transaction.transaction_id,
		date: transaction.date,
		description: transaction.description,
		amount: transaction.amount,
		currency: transaction.currency_code,
		category: transaction.transaction_category_name,
		type_id: isIncome
			? TRANSACTION_TYPE.INCOME.id
			: TRANSACTION_TYPE.EXPENSE.id,
		type_name: transaction.transaction_type_name,
	};
};

const getMonthLabel = (date: string) => {
	const parsedDate = new Date(date);

	if (Number.isNaN(parsedDate.getTime())) {
		return date;
	}

	return parsedDate.toLocaleString("en-US", { month: "short" });
};

const getSpendingTrendData = (transactions: TransactionResponse[]) => {
	const expenseByMonth = new Map<string, number>();

	for (const transaction of transactions) {
		if (transaction.transaction_type_id !== TRANSACTION_TYPE.EXPENSE.id) {
			continue;
		}

		const month = getMonthLabel(transaction.date);
		expenseByMonth.set(
			month,
			(expenseByMonth.get(month) ?? 0) + transaction.amount,
		);
	}

	return Array.from(expenseByMonth.entries()).map(([month, expense]) => ({
		expense,
		month,
	}));
};

const getExpenseCategoryData = (transactions: TransactionResponse[]) => {
	const expenseByCategory = new Map<string, number>();

	for (const transaction of transactions) {
		if (transaction.transaction_type_id !== TRANSACTION_TYPE.EXPENSE.id) {
			continue;
		}

		expenseByCategory.set(
			transaction.transaction_category_name,
			(expenseByCategory.get(transaction.transaction_category_name) ?? 0) +
				transaction.amount,
		);
	}

	return Array.from(expenseByCategory.entries()).map(([name, value]) => ({
		name,
		value,
	}));
};

function Home() {
	const thisMonthRange = getThisMonthRange();
	const thisMonthCriteria = {
		start_date: thisMonthRange.startDate,
		end_date: thisMonthRange.endDate,
	};

	const {
		error: transactionsError,
		isLoading: isTransactionsLoading,
		transactions,
	} = useUserTransactions({
		user_id: MOCK_USER_ID,
		pagination: { limit: 5, offset: 0 },
	});
	const {
		error: incomeError,
		incomeTotal,
		isLoading: isIncomeLoading,
	} = useUserIncomeTotal({
		user_id: MOCK_USER_ID,
		criteria: thisMonthCriteria,
	});
	const {
		error: expenseError,
		expenseTotal,
		isLoading: isExpenseLoading,
	} = useUserExpenseTotal({
		user_id: MOCK_USER_ID,
		criteria: thisMonthCriteria,
	});

	const transactionHistoryData = useMemo(
		() => transactions.map(mapTransaction),
		[transactions],
	);
	const spendingTrendData = useMemo(
		() => getSpendingTrendData(transactions),
		[transactions],
	);
	const expenseCategoryData = useMemo(
		() => getExpenseCategoryData(transactions),
		[transactions],
	);
	const currency = transactionHistoryData[0]?.currency ?? "THB";
	const netBalance = incomeTotal - expenseTotal;
	const isSummaryLoading = isIncomeLoading || isExpenseLoading;
	const hasDashboardError = transactionsError || incomeError || expenseError;

	return (
		<div className="flex flex-col items-center justify-center gap-4">
			{hasDashboardError && (
				<div className="w-full rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
					Unable to load dashboard data from the backend.
				</div>
			)}

			{/* Net, Income, Expense, Saving Rate Section */}
			<div className="flex flex-col lg:flex-row gap-4 w-full">
				{/* Net Card */}
				<DashboardCard
					header={{
						icon: <Wallet size={16} className="text-primary" />,
						title: "NET BALANCE",
					}}
					rightSide={
						<div className="flex items-center gap-2 text-xs lg:text-sm bg-primary/20 px-3 py-1 rounded-2xl">
							<span className="text-primary">
								{netBalance > 0
									? "Positive"
									: netBalance < 0
										? "Negative"
										: "Neutral"}
							</span>
						</div>
					}
					bottomSide={
						<div className="mt-2 flex w-full items-center justify-between border-t pt-3 text-xs text-muted-foreground lg:text-sm">
							<span>Last updated: Today</span>
						</div>
					}
				>
					<span className="text-2xl font-bold text-primary lg:text-4xl">
						{isSummaryLoading
							? "Loading..."
							: formatMoney(netBalance, currency)}
					</span>
				</DashboardCard>

				{/* Income/Expense Card */}
				<DashboardCard
					header={{
						icon: <ChartBarBig size={16} className="text-primary" />,
						title: "INCOME & EXPENSE",
					}}
				>
					<div className="flex gap-4 w-full">
						<DashboardCard
							leftSide={
								<span className="text-xs text-muted-foreground lg:text-sm">
									Income
								</span>
							}
							rightSide={<TrendingUp size={16} className="text-primary" />}
							bgColor="bg-linear-[150deg] from-primary/50 to-primary/10 text-white"
						>
							<span className="text-lg font-bold text-muted-foreground lg:text-xl">
								{isIncomeLoading
									? "Loading..."
									: formatMoney(incomeTotal, currency)}
							</span>
						</DashboardCard>

						<DashboardCard
							leftSide={
								<span className="text-xs text-muted-foreground lg:text-sm">
									Expense
								</span>
							}
							rightSide={<TrendingUp size={16} className="text-destructive" />}
							bgColor="bg-linear-[150deg] from-destructive/50 to-destructive/10 text-white"
						>
							<span className="text-lg font-bold text-muted-foreground lg:text-xl">
								{isExpenseLoading
									? "Loading..."
									: formatMoney(expenseTotal, currency)}
							</span>
						</DashboardCard>
					</div>
				</DashboardCard>

				{/* Saving Card */}
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
						{isSummaryLoading
							? "Loading..."
							: formatMoney(Math.max(netBalance, 0), currency)}
					</span>
				</DashboardCard>
			</div>

			{/* Chart Section */}
			<div className="flex flex-col sm:flex-row gap-4 w-full">
				{/* Spending Trend Chart */}
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
						data={isTransactionsLoading ? [] : spendingTrendData}
						xKey="month"
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

				{/* Expesnse Category */}
				<DashboardCard
					header={{
						icon: <ClockFading size={16} className="text-primary" />,
						title: "EXPENSE CATEGORY",
					}}
					rightSide={
						<div className="flex items-center gap-2 text-xs lg:text-sm bg-primary/20 px-3 py-1 rounded-2xl">
							{/* TODO: link the path */}
							<Link to="/analytic" className="text-primary cursor-pointer">
								<span className="text-primary cursor-pointer">View More</span>
							</Link>
						</div>
					}
				>
					<PieChart
						data={isTransactionsLoading ? [] : expenseCategoryData}
						width={"100%"}
						outerRadius={70}
						height={200}
					/>
				</DashboardCard>
			</div>

			<DashboardCard
				header={{
					icon: <WalletCards size={16} className="text-primary" />,
					title: "TRANSACTION HISTORY",
				}}
				rightSide={
					<div className="flex items-center gap-2 text-xs lg:text-sm bg-primary/20 px-3 py-1 rounded-2xl">
						{/* TODO: link the path */}
						<Link to="/transaction" className="text-primary cursor-pointer">
							<span className="text-primary cursor-pointer">View More</span>
						</Link>
					</div>
				}
			>
				{isTransactionsLoading ? (
					<div className="flex min-h-24 w-full items-center justify-center">
						<span className="text-sm text-muted-foreground">
							Loading transactions...
						</span>
					</div>
				) : (
					<TransactionCard transactions={transactionHistoryData} />
				)}
			</DashboardCard>
		</div>
	);
}
