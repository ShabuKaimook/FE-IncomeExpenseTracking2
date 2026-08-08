import { useQuery } from "@tanstack/react-query";
import { transactionKeys } from "@/features/transactions/api/TransactionQueryKeys";
import type { GetTransactionSummaryRequest } from "@/features/transactions/api/TransactionRequest";
import { TransactionService } from "@/features/transactions/api/TransactionService";

export const useTransactionSummary = (req: GetTransactionSummaryRequest) => {
	const { data, error, isLoading } = useQuery({
		queryKey: transactionKeys.transactionSummary(req),
		queryFn: () => TransactionService.getTransactionSummary(req),
	});

	return { transactionSummary: data ?? [], error, isLoading };
};
