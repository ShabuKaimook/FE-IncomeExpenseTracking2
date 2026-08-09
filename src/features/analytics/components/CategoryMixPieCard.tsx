import { ChartPie } from "lucide-react";
import type { GetTransactionCategorySummaryResponse } from "@/features/userTransactionCategories/api/UserTransactionCategoryResponse";
import { PieChart } from "@/shared/charts/PieChart";
import { DashboardCard } from "@/shared/components/DashboardCard";
import { ChartSkeleton } from "@/shared/components/Skeleton";
import { TRANSACTION_TYPE } from "@/shared/constants/TransactionTypeEnum";

type CategoryMixPieCardProps = {
	categories: GetTransactionCategorySummaryResponse[];
	transactionTypeId: number;
	isLoading: boolean;
};

const getTopFiveWithOther = (
	categories: GetTransactionCategorySummaryResponse[],
) => {
	const sortedCategories = [...categories].sort(
		(left, right) => right.amount - left.amount,
	);
	const topCategories = sortedCategories.slice(0, 5).map((category) => ({
		name: category.user_transaction_category_name,
		value: category.amount,
	}));
	const otherAmount = sortedCategories
		.slice(5)
		.reduce((total, category) => total + category.amount, 0);

	return otherAmount > 0
		? [...topCategories, { name: "Other", value: otherAmount }]
		: topCategories;
};

export function CategoryMixPieCard({
	categories,
	transactionTypeId,
	isLoading,
}: CategoryMixPieCardProps) {
	const chartData = getTopFiveWithOther(categories);
	const hasChartData = chartData.some((category) => category.value > 0);
	const transactionTypeName =
		transactionTypeId === TRANSACTION_TYPE.INCOME.id ? "Income" : "Expense";

	return (
		<DashboardCard
			header={{
				icon: <ChartPie size={16} className="text-primary" />,
				title: `${transactionTypeName.toUpperCase()} CATEGORY`,
			}}
		>
			{isLoading ? (
				<ChartSkeleton height={260} variant="pie" />
			) : (
				<PieChart
					data={hasChartData ? chartData : []}
					height={hasChartData ? 260 : 200}
					outerRadius={82}
					innerRadius={46}
					maxLegendItems={6}
				/>
			)}
		</DashboardCard>
	);
}
