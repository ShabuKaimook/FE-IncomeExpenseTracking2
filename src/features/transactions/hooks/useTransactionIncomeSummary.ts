import { useQuery } from "@tanstack/react-query";
import { transactionKeys } from "@/features/transactions/api/TransactionQueryKeys";
import type { GetTransactionIncomeSummaryRequest } from "@/features/transactions/api/TransactionRequest";
import { TransactionService } from "@/features/transactions/api/TransactionService";

export const useTransactionIncomeSummary = (
	req: GetTransactionIncomeSummaryRequest,
) => {
	const { data, error, isLoading } = useQuery({
		queryKey: transactionKeys.incomeSummary(req),
		queryFn: () => TransactionService.getTransactionIncomeSummary(req),
	});

	return { incomeSummary: data ?? [], error, isLoading };
};
