import { useQuery } from "@tanstack/react-query";
import { userTransactionCategoryKeys } from "@/features/userTransactionCategories/api/UserTransactionCategoryQueryKeys";
import { UserTransactionCategoryService } from "@/features/userTransactionCategories/api/UserTransactionCategoryService";

export const useUserTransactionCategories = () => {
	const { data, error, isLoading } = useQuery({
		queryKey: userTransactionCategoryKeys.list(),
		queryFn: () => UserTransactionCategoryService.getUserTransactionCategories(),
	});

	return { categories: data ?? [], error, isLoading };
};
