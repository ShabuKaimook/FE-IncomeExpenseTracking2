import { useQuery } from "@tanstack/react-query";
import { userTransactionCategoryKeys } from "@/features/userTransactionCategories/api/UserTransactionCategoryQueryKeys";
import type { GetUserTransactionCategoryAmountsRequest } from "@/features/userTransactionCategories/api/UserTransactionCategoryRequest";
import { UserTransactionCategoryService } from "@/features/userTransactionCategories/api/UserTransactionCategoryService";

export function useUserTransactionCategoryAmounts(
	req: GetUserTransactionCategoryAmountsRequest,
) {
	const { data, error, isLoading } = useQuery({
		queryKey: userTransactionCategoryKeys.amounts(req),
		queryFn: () => UserTransactionCategoryService.getUserTransactionCategoryAmounts(req),
	});

	return { categories: data ?? [], error, isLoading };
}
