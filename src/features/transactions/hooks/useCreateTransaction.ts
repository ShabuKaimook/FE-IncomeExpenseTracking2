import { useMutation, useQueryClient } from "@tanstack/react-query";
import { transactionKeys } from "@/features/transactions/api/TransactionQueryKeys";
import type { CreateTransactionRequest } from "@/features/transactions/api/TransactionRequest";
import { TransactionService } from "@/features/transactions/api/TransactionService";

export const useCreateTransaction = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (body: CreateTransactionRequest) =>
			TransactionService.createTransaction(body),
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({
				queryKey: transactionKeys.list(variables.user_id),
			});
			queryClient.invalidateQueries({
				queryKey: transactionKeys.incomeTotal(variables.user_id),
			});
			queryClient.invalidateQueries({
				queryKey: transactionKeys.expenseTotal(variables.user_id),
			});
		},
	});
};
