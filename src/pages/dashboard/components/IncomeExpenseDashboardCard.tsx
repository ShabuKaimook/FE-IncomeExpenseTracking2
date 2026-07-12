import { DashboardCard } from "#/components/DashboardCard";
import { LoadingSpinner } from "#/components/LoadingSpinner";
import { ChartBarBig, TrendingUp, TrendingDown } from "lucide-react";
import { formatMoney } from "#/utils/FormatMoney";

export const IncomeExpenseDashboardCard = ({
  isIncomeLoading,
  incomeTotal,
  isExpenseLoading,
  expenseTotal,
  currency,
}: {
  isIncomeLoading: boolean;
  incomeTotal: number;
  isExpenseLoading: boolean;
  expenseTotal: number;
  currency: string;
}) => {
  return (
    <DashboardCard
      header={{
        icon: <ChartBarBig size={16} className="text-primary" />,
        title: "INCOME & EXPENSE",
      }}
    >
      <div className="flex gap-4 w-full">
        <IncomeExpenseCard
					title="Income"
					icon={<TrendingUp size={16} className="text-primary" />}
					isLoading={isIncomeLoading}
					amount={incomeTotal}
					currency={currency}
				/>

				<IncomeExpenseCard
					title="Expense"
					icon={<TrendingDown size={16} className="text-primary" />}
					bg="bg-linear-[150deg] from-destructive/50 to-destructive/10 text-white"
					isLoading={isExpenseLoading}
					amount={expenseTotal}
					currency={currency}
				/>
      </div>
    </DashboardCard>
  );
};

const IncomeExpenseCard = ({
	title,
	icon,
	bg,
	isLoading,
	amount,
	currency,
}: {
	title: string;
	icon: React.ReactNode;
	bg?: string;
	isLoading: boolean;
	amount: number;
	currency: string;
}) => {
  return (
    <DashboardCard
      leftSide={
        <span className="text-xs text-muted-foreground lg:text-sm">{title}</span>
      }
      rightSide={icon}
      bgColor={bg ?? "bg-linear-[150deg] from-primary/50 to-primary/10 text-white"}
    >
      <span className="text-lg font-bold text-muted-foreground lg:text-xl">
        {isLoading ? (
          <LoadingSpinner size={20} label={`Loading ${title.toLowerCase()} total`} />
        ) : (
          formatMoney(amount, currency)
        )}
      </span>
    </DashboardCard>
  );
};

export default IncomeExpenseDashboardCard;
