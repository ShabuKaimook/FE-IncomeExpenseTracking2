import { useMutation, useQueryClient } from "@tanstack/react-query";
import { transactionKeys } from "@/features/transactions/api/TransactionQueryKeys";
import { TransactionService } from "@/features/transactions/api/TransactionService";

export const useDeleteTransaction = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (transactionId: string) =>
			TransactionService.deleteTransaction(transactionId),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: transactionKeys.all,
			});
		},
	});
};
