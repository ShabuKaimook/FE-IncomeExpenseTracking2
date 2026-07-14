import { useQuery } from "@tanstack/react-query";
import { transactionKeys } from "@/features/transactions/api/TransactionQueryKeys";
import type { GetUserExpenseTotalRequest } from "@/features/transactions/api/TransactionRequest";
import { TransactionService } from "@/features/transactions/api/TransactionService";

export const useUserExpenseTotal = (req: GetUserExpenseTotalRequest) => {
	const { data, error, isLoading } = useQuery({
		queryKey: transactionKeys.expenseTotal(req),
		queryFn: () => TransactionService.getUserExpenseTotal(req),
	});

	return { error, expenseTotal: data ?? 0, isLoading };
};
