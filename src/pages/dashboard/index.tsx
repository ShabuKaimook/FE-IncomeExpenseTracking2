import { useEffect } from "react";
import { useUserTransactions } from "#/hooks/transactions/useUserTransactions";
import { toast } from "react-toastify";
import { MOCK_USER_ID } from "#/constants/user";
import { useUserExpenseTotal } from "#/hooks/transactions/useUserExpenseTotal";
import { useUserIncomeTotal } from "#/hooks/transactions/useUserIncomeTotal";
import { getThisMonthRange } from "#/utils/Month";
import NetBalanceDashboardCard from "./components/NetBalanceDashBoardCard";
import IncomeExpenseDashboardCard from "./components/IncomeExpenseDashboardCard";
import { SpendingTrendDashboardCard } from "./components/SpendingTrendDashboardCard";
import { TransactionHistoryDashboardCard } from "./components/TransactionHistoryDashboardCard";
import ExpenseCategorySummaryDashboard from "./components/ExpenseCategorySummaryDashboard";
import { SavingRateDashboardCard } from "./components/SavingRateDashboardCard";
import { formatRelativeDate } from "#/utils/FormatDate";

export default function DashboardPage() {
  const thisMonthRange = getThisMonthRange();
  const thisMonthCriteria = {
    start_date: thisMonthRange.startDate,
    end_date: thisMonthRange.endDate,
  };

  // TOTAL INCOME, EXPENSE, NET BALANCE
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

  const {
    error: transactionsError,
    isLoading: isTransactionsLoading,
    transactions,
  } = useUserTransactions({
    user_id: MOCK_USER_ID,
    pagination: { limit: 5, offset: 0 }, // TODO: need to fetch the latest 5 transactions
  });

  const netBalance = incomeTotal - expenseTotal;
  const isNetBalanceLoading =
    isIncomeLoading || isExpenseLoading || isTransactionsLoading;

  const currency = "THB"; // TODO: Fetch the user's preferred currency from the backend or user settings
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
      {/* Net, Income, Expense, Saving Rate Section */}
      <div className="flex flex-col lg:flex-row gap-4 w-full">
        {/* Net Card */}
        <NetBalanceDashboardCard
          netBalance={netBalance}
					lastUpdated={transactions && transactions.length > 0 ? formatRelativeDate(transactions[0].date) : "N/A"}
          currency={currency}
          isLoading={isNetBalanceLoading}
        />

        {/* Income/Expense Card */}
        <IncomeExpenseDashboardCard
          isIncomeLoading={isIncomeLoading}
          incomeTotal={incomeTotal}
          isExpenseLoading={isExpenseLoading}
          expenseTotal={expenseTotal}
          currency={currency}
        />

        {/* Saving Card */}
        <SavingRateDashboardCard />
      </div>

      {/* Chart Section */}
      <div className="flex flex-col sm:flex-row gap-4 w-full">
        {/* Spending Trend Chart */}
        <SpendingTrendDashboardCard />

        {/* Expesnse Category */}
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
