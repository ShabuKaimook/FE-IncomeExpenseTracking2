import { useQuery } from "@tanstack/react-query";
import { transactionKeys } from "@/features/transactions/api/TransactionQueryKeys";
import type { GetTransactionRequest } from "@/features/transactions/api/TransactionRequest";
import { TransactionService } from "@/features/transactions/api/TransactionService";

export const useUserTransactions = (
	req: GetTransactionRequest,
	enabled = true,
) => {
	const { data, error, isLoading } = useQuery({
		queryKey: transactionKeys.list(req),
		queryFn: () => TransactionService.getUserTransactions(req),
		enabled,
	});

	return { transactions: data ?? [], error, isLoading };
};
