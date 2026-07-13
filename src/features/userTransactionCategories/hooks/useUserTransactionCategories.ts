import { useQuery } from "@tanstack/react-query";
import { userTransactionCategoryKeys } from "@/features/userTransactionCategories/api/UserTransactionCategoryQueryKeys";
import { UserTransactionCategoryService } from "@/features/userTransactionCategories/api/UserTransactionCategoryService";

export const useUserTransactionCategories = (userId: string) => {
	const { data, error, isLoading } = useQuery({
		queryKey: userTransactionCategoryKeys.list(userId),
		queryFn: () =>
			UserTransactionCategoryService.getUserTransactionCategories(userId),
		enabled: !!userId,
	});

	return { categories: data ?? [], error, isLoading };
};
