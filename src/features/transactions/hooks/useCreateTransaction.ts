import { useMutation, useQueryClient } from "@tanstack/react-query";
import { transactionKeys } from "@/features/transactions/api/TransactionQueryKeys";
import type { CreateTransactionRequest } from "@/features/transactions/api/TransactionRequest";
import { TransactionService } from "@/features/transactions/api/TransactionService";

export const useCreateTransaction = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (body: CreateTransactionRequest) =>
			TransactionService.createTransaction(body),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: transactionKeys.lists(),
			});
			queryClient.invalidateQueries({
				queryKey: transactionKeys.all,
			});
		},
	});
};
