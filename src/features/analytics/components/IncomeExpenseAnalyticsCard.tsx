import {
	ChartPie,
	Columns2,
	type LucideIcon,
	TrendingDown,
	TrendingUp,
} from "lucide-react";
import { PieChart } from "@/shared/charts/PieChart";
import CustomSegmentedControl from "@/shared/components/CustomSegmentedControl";
import { DashboardCard } from "@/shared/components/DashboardCard";
import { Skeleton } from "@/shared/components/Skeleton";
import { formatMoney } from "@/shared/utils/FormatMoney";

export type IncomeExpenseView = "cards" | "chart";

const incomeExpenseViews = [
	{ label: <Columns2 size={16} aria-hidden />, value: "cards" },
	{ label: <ChartPie size={16} aria-hidden />, value: "chart" },
] as const;

export function IncomeExpenseAnalyticsCard({
	view,
	onViewChange,
	incomeTotal,
	expenseTotal,
	isIncomeLoading,
	isExpenseLoading,
	currency,
}: {
	view: IncomeExpenseView;
	onViewChange: (view: IncomeExpenseView) => void;
	incomeTotal: number;
	expenseTotal: number;
	isIncomeLoading: boolean;
	isExpenseLoading: boolean;
	currency: string;
}) {
	const isLoading = isIncomeLoading || isExpenseLoading;

	return (
		<DashboardCard
			header={{
				icon: <TrendingUp size={16} className="text-primary" />,
				title: "INCOME & EXPENSE",
			}}
			rightSide={
				<CustomSegmentedControl
					ariaLabel="Income expense display"
					value={view}
					options={incomeExpenseViews}
					onValueChange={onViewChange}
					className="h-9!"
					itemClassName="!px-1.5"
				/>
			}
		>
			{view === "chart" ? (
				isLoading ? (
					<Skeleton
						className="h-36 w-full"
						label="Loading income expense chart"
					/>
				) : (
					<PieChart
						data={[
							{ name: "Income", value: incomeTotal },
							{ name: "Expense", value: expenseTotal },
						].filter((item) => item.value > 0)}
						height={144}
						innerRadius={34}
						outerRadius={54}
						colors={["var(--primary)", "var(--destructive)"]}
					/>
				)
			) : (
				<div className="flex w-full gap-4">
					<IncomeExpenseAmountCard
						title="Income"
						icon={TrendingUp}
						isLoading={isIncomeLoading}
						amount={incomeTotal}
						currency={currency}
					/>
					<IncomeExpenseAmountCard
						title="Expense"
						icon={TrendingDown}
						bg="bg-linear-[150deg] from-destructive/50 to-destructive/10 text-white"
						isLoading={isExpenseLoading}
						amount={expenseTotal}
						currency={currency}
					/>
				</div>
			)}
		</DashboardCard>
	);
}

function IncomeExpenseAmountCard({
	title,
	icon: Icon,
	bg,
	isLoading,
	amount,
	currency,
}: {
	title: string;
	icon: LucideIcon;
	bg?: string;
	isLoading: boolean;
	amount: number;
	currency: string;
}) {
	return isLoading ? (
		<Skeleton
			className="h-21 w-full"
			label={`Loading ${title.toLowerCase()} total`}
		/>
	) : (
		<DashboardCard
			leftSide={
				<span className="text-xs text-muted-foreground lg:text-sm">
					{title}
				</span>
			}
			rightSide={<Icon size={16} className="text-primary" />}
			bgColor={
				bg ?? "bg-linear-[150deg] from-primary/50 to-primary/10 text-white"
			}
		>
			<span className="text-lg font-bold text-muted-foreground lg:text-xl">
				{formatMoney(amount, currency)}
			</span>
		</DashboardCard>
	);
}
