import { ChartNoAxesColumnIncreasing } from "lucide-react";
import type { TrendPeriod } from "@/features/analytics/utils/trendPeriods";
import type { UserTransactionCategoryResponse } from "@/features/userTransactionCategories/api/UserTransactionCategoryResponse";
import { BarChart } from "@/shared/charts/BarChart";
import { DashboardCard } from "@/shared/components/DashboardCard";
import { DropDown } from "@/shared/components/DropDown";
import { ChartSkeleton } from "@/shared/components/Skeleton";
import { ChartTheme } from "@/shared/constants/ChartThemeEnum";
import { TRANSACTION_TYPE } from "@/shared/constants/TransactionTypeEnum";
import { formatMoney, formatNumber } from "@/shared/utils/FormatMoney";

type CategoryTrendCardProps = {
	categoryId: string | null;
	categories: UserTransactionCategoryResponse[];
	periods: TrendPeriod[];
	isLoading: boolean;
	onSelectCategory: (category: UserTransactionCategoryResponse) => void;
};

const getMockAmount = (categoryId: string, index: number) => {
	const seed = categoryId
		.split("")
		.reduce((total, char) => total + char.charCodeAt(0), 0);

	return Math.round(900 + ((seed + index * 571) % 3800));
};

const formatCategoryTrendPeriod = (date: Date) =>
	date.toLocaleDateString("en-US", {
		month: "short",
		year: "2-digit",
	});

export function CategoryTrendCard({
	categoryId,
	categories,
	periods,
	isLoading,
	onSelectCategory,
}: CategoryTrendCardProps) {
	const selectedCategory = categories.find(
		(category) => category.user_transaction_category_id === categoryId,
	);
	const categoryName =
		selectedCategory?.user_transaction_category_name ?? "Select category";
	const incomeCategories = categories.filter(
		(category) => category.transaction_type_id === TRANSACTION_TYPE.INCOME.id,
	);
	const expenseCategories = categories.filter(
		(category) => category.transaction_type_id === TRANSACTION_TYPE.EXPENSE.id,
	);
	const chartColor =
		selectedCategory?.transaction_type_id === TRANSACTION_TYPE.EXPENSE.id
			? ChartTheme.destructive.color
			: ChartTheme.primary.color;
	const data =
		categoryId == null
			? []
			: periods.map((period, index) => ({
					period: formatCategoryTrendPeriod(period.startDate),
					amount: getMockAmount(categoryId, index),
				}));
	const chartHeight = data.length === 0 ? 200 : 260;

	return (
		<DashboardCard
			header={{
				icon: (
					<ChartNoAxesColumnIncreasing size={16} className="text-primary" />
				),
				title: "CATEGORY TREND",
			}}
			rightSide={
				categories.length > 0 ? (
					<DropDown
						triggerAriaLabel="Select category trend"
						placeholder="Category"
						selectedValues={categoryId ? [categoryId] : []}
						sections={[
							{
								sectionName: "Income",
								sectionType: "radio",
								items: incomeCategories.map((category) => ({
									title: category.user_transaction_category_name,
									value: category.user_transaction_category_id,
								})),
							},
							{
								sectionName: "Expense",
								sectionType: "radio",
								items: expenseCategories.map((category) => ({
									title: category.user_transaction_category_name,
									value: category.user_transaction_category_id,
								})),
							},
						]}
						onItemSelect={({ item }) => {
							const category = categories.find(
								(categoryItem) =>
									categoryItem.user_transaction_category_id === item.value,
							);

							if (category) {
								onSelectCategory(category);
							}
						}}
						triggerClassName="h-9 min-h-9 w-44"
						contentClassName="max-h-80 overflow-y-auto"
						isShowTriggerLabel={false}
					/>
				) : null
			}
		>
			{isLoading ? (
				<ChartSkeleton height={260} />
			) : (
				<BarChart
					data={data}
					xKey="period"
					bars={[
						{
							dataKey: "amount",
							name: categoryName ?? "Category",
							color: chartColor,
							gradient: true,
						},
					]}
					height={chartHeight}
					showGrid
					showYAxis
					valueFormatter={(value) => formatMoney(value, "THB")}
					tooltipValueFormatter={formatNumber}
				/>
			)}
		</DashboardCard>
	);
}
