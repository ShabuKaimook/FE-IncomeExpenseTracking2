import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userTransactionCategoryKeys } from "@/features/userTransactionCategories/api/UserTransactionCategoryQueryKeys";
import type { DeleteUserTransactionCategoryRequest } from "@/features/userTransactionCategories/api/UserTransactionCategoryRequest";
import { UserTransactionCategoryService } from "@/features/userTransactionCategories/api/UserTransactionCategoryService";

export const useDeleteUserTransactionCategory = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (body: DeleteUserTransactionCategoryRequest) =>
			UserTransactionCategoryService.deleteUserTransactionCategory(body),
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({
				queryKey: userTransactionCategoryKeys.list(variables.user_id),
			});
		},
	});
};
