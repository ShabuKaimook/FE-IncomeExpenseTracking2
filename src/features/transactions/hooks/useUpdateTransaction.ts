import { useMutation, useQueryClient } from "@tanstack/react-query";
import { transactionKeys } from "@/features/transactions/api/TransactionQueryKeys";
import { userTransactionCategoryKeys } from "@/features/userTransactionCategories/api/UserTransactionCategoryQueryKeys";
import type { UpdateTransactionRequest } from "@/features/transactions/api/TransactionRequest";
import { TransactionService } from "@/features/transactions/api/TransactionService";

type UpdateTransactionMutationRequest = {
	transactionId: string;
	body: UpdateTransactionRequest;
};

export const useUpdateTransaction = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ transactionId, body }: UpdateTransactionMutationRequest) =>
			TransactionService.updateTransaction(transactionId, body),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: transactionKeys.all,
			});
			queryClient.invalidateQueries({
				queryKey: userTransactionCategoryKeys.all,
			});
		},
	});
};
