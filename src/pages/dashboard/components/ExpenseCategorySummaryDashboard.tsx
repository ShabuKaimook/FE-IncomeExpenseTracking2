import { DashboardCard } from "#/components/DashboardCard";
import { PieChart } from "#/components/charts/PieChart";
import { ClockFading } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useUserTransactionCategorySummary } from "#/hooks/userTransactionCategories/useUserTransactioNCategorySummary";
import { MOCK_USER_ID } from "#/constants/user";
import { getThisMonthRange } from "#/utils/Month";
import { TRANSACTION_TYPE } from "#/constants/TransactionType.enum";
import { LoadingSpinner } from "#/components/LoadingSpinner";

const ExpenseCategorySummaryDashboard = () => {
  const {
    summary: expenseCategorySummary,
    error,
    isLoading,
  } = useUserTransactionCategorySummary({
    user_id: MOCK_USER_ID,
    periods: [
      {
        start_date: getThisMonthRange().startDate,
        end_date: getThisMonthRange().endDate,
      },
    ],
    criteria: {
      transaction_type_ids: [TRANSACTION_TYPE.EXPENSE.id],
    },
  });

  useEffect(() => {
    if (error) {
      toast.error(
        "Failed to fetch expense category summary. Please try again later.",
      );
    }
  }, [error]);

  return (
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
      children={
        isLoading ? (
          <LoadingSpinner />
        ) : (
          <PieChart
            data={expenseCategorySummary.map((item) => ({
              name: item.transaction_category_name,
              value: item.amount,
            }))}
            width={"100%"}
            outerRadius={70}
            height={200}
          />
        )
      }
    ></DashboardCard>
  );
};

export default ExpenseCategorySummaryDashboard;
