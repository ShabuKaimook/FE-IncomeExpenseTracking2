import { useQuery } from "@tanstack/react-query";
import { transactionKeys } from "@/constants/queryKeys/transaction";
import { TransactionService } from "@/services/TransactionService";
import type { GetUserExpenseTotalRequest } from "@/services/TransactionService/types/TransactionRequest";

export const useUserExpenseTotal = (req: GetUserExpenseTotalRequest) => {
	const { data, error, isLoading } = useQuery({
		queryKey: transactionKeys.expenseTotal(req),
		queryFn: () => TransactionService.getUserExpenseTotal(req),
		enabled: !!req.user_id,
	});

	return { error, expenseTotal: data ?? 0, isLoading };
};
