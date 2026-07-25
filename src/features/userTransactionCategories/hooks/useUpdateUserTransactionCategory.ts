import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userTransactionCategoryKeys } from "@/features/userTransactionCategories/api/UserTransactionCategoryQueryKeys";
import type { UpdateUserTransactionCategoryRequest } from "@/features/userTransactionCategories/api/UserTransactionCategoryRequest";
import { UserTransactionCategoryService } from "@/features/userTransactionCategories/api/UserTransactionCategoryService";

type UpdateUserTransactionCategoryMutationRequest = {
	userTransactionCategoryId: string;
	body: UpdateUserTransactionCategoryRequest;
};

export const useUpdateUserTransactionCategory = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ userTransactionCategoryId, body }: UpdateUserTransactionCategoryMutationRequest) =>
			UserTransactionCategoryService.updateUserTransactionCategory(
				userTransactionCategoryId,
				body,
			),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: userTransactionCategoryKeys.all,
			});
		},
	});
};
