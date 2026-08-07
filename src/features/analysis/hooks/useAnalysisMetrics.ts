import { useQuery } from "@tanstack/react-query";
import { transactionKeys } from "@/features/transactions/api/TransactionQueryKeys";
import { TransactionService } from "@/features/transactions/api/TransactionService";
import { userTransactionCategoryKeys } from "@/features/userTransactionCategories/api/UserTransactionCategoryQueryKeys";
import { UserTransactionCategoryService } from "@/features/userTransactionCategories/api/UserTransactionCategoryService";

interface UseAnalysisMetricsRequest {
	start_date: string;
	end_date: string;
	user_transaction_category_ids?: string[];
	trend_user_transaction_category_id?: string;
}

export function useAnalysisMetrics({
	start_date,
	end_date,
	user_transaction_category_ids,
	trend_user_transaction_category_id,
}: UseAnalysisMetricsRequest) {
	const filteredReq = {
		end_date,
		start_date,
		user_transaction_category_ids,
	};
	const trendReq = {
		end_date,
		start_date,
		user_transaction_category_id: trend_user_transaction_category_id ?? "",
	};

	const categoryTrend = useQuery({
		queryKey: userTransactionCategoryKeys.trend(trendReq),
		queryFn: () => UserTransactionCategoryService.getCategoryTrend(trendReq),
		enabled: Boolean(trend_user_transaction_category_id),
	});
	const averageTransactionSize = useQuery({
		queryKey: userTransactionCategoryKeys.averageTransactionSize(filteredReq),
		queryFn: () =>
			UserTransactionCategoryService.getAverageTransactionSize(filteredReq),
	});
	const spendingHeatmap = useQuery({
		queryKey: transactionKeys.spendingHeatmap(filteredReq),
		queryFn: () => TransactionService.getSpendingHeatmap(filteredReq),
	});
	const fixedVsVariable = useQuery({
		queryKey: transactionKeys.fixedVsVariable(filteredReq),
		queryFn: () => TransactionService.getFixedVsVariable(filteredReq),
	});
	const recurringTransactions = useQuery({
		queryKey: transactionKeys.recurring(filteredReq),
		queryFn: () => TransactionService.getRecurringTransactions(filteredReq),
	});

	return {
		averageTransactionSize: averageTransactionSize.data ?? [],
		categoryTrend: categoryTrend.data ?? [],
		fixedVsVariable: fixedVsVariable.data ?? {
			fixed_amount: 0,
			variable_amount: 0,
		},
		isLoading:
			categoryTrend.isLoading ||
			averageTransactionSize.isLoading ||
			spendingHeatmap.isLoading ||
			fixedVsVariable.isLoading ||
			recurringTransactions.isLoading,
		recurringTransactions: recurringTransactions.data ?? [],
		spendingHeatmap: spendingHeatmap.data ?? [],
	};
}
