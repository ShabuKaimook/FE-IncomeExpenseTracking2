import { useEffect } from "react";
import { toast } from "react-toastify";
import { useTransactionBalanceSummary } from "@/features/transactions/hooks/useTransactionBalanceSummary";
import { useUserTransactions } from "@/features/transactions/hooks/useUserTransactions";
import { dateToString, getCurrentMonthDateRange } from "@/shared/utils/date";
import ExpenseCategorySummaryDashboard from "./components/ExpenseCategorySummaryDashboard";
import IncomeExpenseDashboardCard from "./components/IncomeExpenseDashboardCard";
import NetBalanceDashboardCard from "./components/NetBalanceDashboardCard";
import { SavingRateDashboardCard } from "./components/SavingRateDashboardCard";
import { SpendingTrendDashboardCard } from "./components/SpendingTrendDashboardCard";
import { TransactionHistoryDashboardCard } from "./components/TransactionHistoryDashboardCard";

export default function DashboardPage() {
	const thisMonthRange = getCurrentMonthDateRange();

	const {
		balanceSummary,
		error: balanceSummaryError,
		isLoading: isBalanceSummaryLoading,
	} = useTransactionBalanceSummary({
		period_mode: "month",
		periods: [
			{
				start_date: dateToString(thisMonthRange.startDate),
				end_date: dateToString(thisMonthRange.endDate),
			},
		],
	});

	const {
		error: transactionsError,
		isLoading: isTransactionsLoading,
		transactions,
	} = useUserTransactions({
		pagination: { limit: 5, page: 0 },
	});

	const isNetBalanceLoading = isBalanceSummaryLoading || isTransactionsLoading;

	const currency = "THB";
	const hasDashboardError = balanceSummaryError || transactionsError;

	useEffect(() => {
		if (!hasDashboardError) {
			return;
		}

		toast.error("Unable to load dashboard data from the backend.", {
			toastId: "dashboard-load-error",
		});
	}, [hasDashboardError]);

	return (
		<div className="flex flex-col items-center justify-center gap-4">
			<div className="flex w-full flex-col gap-4 lg:flex-row">
				<NetBalanceDashboardCard
					netBalance={balanceSummary.net_balance}
					currency={currency}
					isLoading={isNetBalanceLoading}
				/>

				<IncomeExpenseDashboardCard
					isIncomeLoading={isBalanceSummaryLoading}
					incomeTotal={balanceSummary.income}
					isExpenseLoading={isBalanceSummaryLoading}
					expenseTotal={balanceSummary.expense}
					currency={currency}
				/>

				<SavingRateDashboardCard />
			</div>

			<div className="flex w-full flex-col gap-4 sm:flex-row">
				<SpendingTrendDashboardCard />
				<ExpenseCategorySummaryDashboard />
			</div>

			<TransactionHistoryDashboardCard
				transactions={transactions}
				isTransactionsLoading={isTransactionsLoading}
				transactionsError={transactionsError}
			/>
		</div>
	);
}
