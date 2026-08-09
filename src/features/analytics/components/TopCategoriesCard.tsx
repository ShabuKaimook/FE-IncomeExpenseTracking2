import { Tags } from "lucide-react";
import type { GetTransactionCategorySummaryResponse } from "@/features/userTransactionCategories/api/UserTransactionCategoryResponse";
import { DashboardCard } from "@/shared/components/DashboardCard";
import { Skeleton } from "@/shared/components/Skeleton";
import { formatMoney } from "@/shared/utils/FormatMoney";

const skeletonKeys = [
	"category-skeleton-1",
	"category-skeleton-2",
	"category-skeleton-3",
	"category-skeleton-4",
	"category-skeleton-5",
];

type TopCategoriesCardProps = {
	categories: GetTransactionCategorySummaryResponse[];
	previousCategories: GetTransactionCategorySummaryResponse[];
	selectedCategoryId: string | null;
	isLoading: boolean;
	onSelectCategory: (category: GetTransactionCategorySummaryResponse) => void;
};

const getTrendPercent = (
	category: GetTransactionCategorySummaryResponse,
	previousCategories: GetTransactionCategorySummaryResponse[],
) => {
	const previousAmount =
		previousCategories.find(
			(previousCategory) =>
				previousCategory.user_transaction_category_id ===
				category.user_transaction_category_id,
		)?.amount ?? 0;

	if (previousAmount === 0) {
		return category.amount === 0 ? 0 : 100;
	}

	return ((category.amount - previousAmount) / previousAmount) * 100;
};

export function TopCategoriesCard({
	categories,
	previousCategories,
	selectedCategoryId,
	isLoading,
	onSelectCategory,
}: TopCategoriesCardProps) {
	const sortedCategories = [...categories].sort(
		(left, right) => right.amount - left.amount,
	);

	return (
		<DashboardCard
			header={{
				icon: <Tags size={16} className="text-primary" />,
				title: "TOP CATEGORIES",
			}}
		>
			{isLoading ? (
				<div className="flex w-full flex-col gap-2">
					{skeletonKeys.map((key) => (
						<Skeleton key={key} className="h-12 w-full" />
					))}
				</div>
			) : sortedCategories.length === 0 ? (
				<div className="flex h-[200px] w-full items-center justify-center text-sm text-muted-foreground">
					No category data available
				</div>
			) : (
				<div className="flex max-h-[320px] w-full flex-col gap-2 overflow-y-auto pr-1">
					{sortedCategories.map((category) => {
						const trendPercent = getTrendPercent(category, previousCategories);
						const isSelected =
							category.user_transaction_category_id === selectedCategoryId;

						return (
							<button
								key={category.user_transaction_category_id}
								type="button"
								className={`flex w-full items-center justify-between gap-3 rounded-lg border px-3 py-2 text-left transition hover:border-primary/50 hover:bg-primary/5 ${
									isSelected
										? "border-primary bg-primary/10"
										: "border-(--line)"
								}`}
								onClick={() => onSelectCategory(category)}
							>
								<div className="min-w-0">
									<p className="truncate text-sm font-medium">
										{category.user_transaction_category_name}
									</p>
									<p
										className={`text-xs ${
											trendPercent > 0 ? "text-destructive" : "text-emerald-600"
										}`}
									>
										{trendPercent >= 0 ? "+" : ""}
										{trendPercent.toFixed(0)}% vs previous
									</p>
								</div>
								<span className="shrink-0 text-sm font-semibold">
									{formatMoney(category.amount, "THB")}
								</span>
							</button>
						);
					})}
				</div>
			)}
		</DashboardCard>
	);
}
