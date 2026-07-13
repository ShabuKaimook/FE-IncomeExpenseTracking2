import { useQuery } from "@tanstack/react-query";
import { userTransactionCategoryKeys } from "@/features/userTransactionCategories/api/UserTransactionCategoryQueryKeys";
import type { GetUserTransactionCategorySummaryRequest } from "@/features/userTransactionCategories/api/UserTransactionCategoryRequest";
import type { GetTransactionCategorySummaryResponse } from "@/features/userTransactionCategories/api/UserTransactionCategoryResponse";
import { UserTransactionCategoryService } from "@/features/userTransactionCategories/api/UserTransactionCategoryService";

export function useUserTransactionCategorySummary(
	req: GetUserTransactionCategorySummaryRequest,
) {
	const { data, error, isLoading } = useQuery<
		GetTransactionCategorySummaryResponse[]
	>({
		queryKey: userTransactionCategoryKeys.summary(req),
		queryFn: () =>
			UserTransactionCategoryService.getUserTransactionCategorySummary(req),
		enabled: !!req.user_id,
	});

	return { summary: data ?? [], error, isLoading };
}
