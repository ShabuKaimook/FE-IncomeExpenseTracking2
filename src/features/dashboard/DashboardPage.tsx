import { useEffect } from "react";
import { toast } from "react-toastify";
import { useUserExpenseTotal } from "@/features/transactions/hooks/useUserExpenseTotal";
import { useUserIncomeTotal } from "@/features/transactions/hooks/useUserIncomeTotal";
import { useUserTransactions } from "@/features/transactions/hooks/useUserTransactions";
import { formatRelativeDate } from "@/shared/utils/FormatDate";
import { getThisMonthRange } from "@/shared/utils/Month";
import ExpenseCategorySummaryDashboard from "./components/ExpenseCategorySummaryDashboard";
import IncomeExpenseDashboardCard from "./components/IncomeExpenseDashboardCard";
import NetBalanceDashboardCard from "./components/NetBalanceDashboardCard";
import { SavingRateDashboardCard } from "./components/SavingRateDashboardCard";
import { SpendingTrendDashboardCard } from "./components/SpendingTrendDashboardCard";
import { TransactionHistoryDashboardCard } from "./components/TransactionHistoryDashboardCard";

export default function DashboardPage() {
	const thisMonthRange = getThisMonthRange();
	const thisMonthCriteria = {
		start_date: thisMonthRange.startDate,
		end_date: thisMonthRange.endDate,
	};

	const {
		error: incomeError,
		incomeTotal,
		isLoading: isIncomeLoading,
	} = useUserIncomeTotal({
		criteria: thisMonthCriteria,
	});

	const {
		error: expenseError,
		expenseTotal,
		isLoading: isExpenseLoading,
	} = useUserExpenseTotal({
		criteria: thisMonthCriteria,
	});

	const {
		error: transactionsError,
		isLoading: isTransactionsLoading,
		transactions,
	} = useUserTransactions({
		pagination: { limit: 5, offset: 0 },
	});

	const netBalance = incomeTotal - expenseTotal;
	const isNetBalanceLoading =
		isIncomeLoading || isExpenseLoading || isTransactionsLoading;

	const currency = "THB";
	const hasDashboardError = incomeError || expenseError || transactionsError;

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
					netBalance={netBalance}
					lastUpdated={
						transactions.length > 0
							? formatRelativeDate(transactions[0].date)
							: "N/A"
					}
					currency={currency}
					isLoading={isNetBalanceLoading}
				/>

				<IncomeExpenseDashboardCard
					isIncomeLoading={isIncomeLoading}
					incomeTotal={incomeTotal}
					isExpenseLoading={isExpenseLoading}
					expenseTotal={expenseTotal}
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
