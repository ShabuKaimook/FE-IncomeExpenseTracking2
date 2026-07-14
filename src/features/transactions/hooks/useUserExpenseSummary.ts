import { useQuery } from "@tanstack/react-query";
import { transactionKeys } from "@/features/transactions/api/TransactionQueryKeys";
import type { GetUserExpenseSummaryRequest } from "@/features/transactions/api/TransactionRequest";
import { TransactionService } from "@/features/transactions/api/TransactionService";

export const useUserExpenseSummary = (req: GetUserExpenseSummaryRequest) => {
	const { data, error, isLoading } = useQuery({
		queryKey: transactionKeys.expenseSummary(req),
		queryFn: () => TransactionService.getUserExpenseSummary(req),
	});
	return { expenseSummary: data, error, isLoading };
};
