import { useQuery } from "@tanstack/react-query";
import { transactionKeys } from "@/constants/queryKeys/transaction";
import { TransactionService } from "@/services/TransactionService";

import type { GetTransactionRequest } from "@/services/TransactionService/types/TransactionRequest";

export const useUserTransactions = (req: GetTransactionRequest) => {
	const { data, error, isLoading } = useQuery({
		queryKey: transactionKeys.list(req),
		queryFn: () => TransactionService.getUserTransactions(req),
		enabled: !!req.user_id,
	});

	return { transactions: data ?? [], error, isLoading };
};
