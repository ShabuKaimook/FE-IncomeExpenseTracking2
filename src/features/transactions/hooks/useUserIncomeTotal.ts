import { useQuery } from "@tanstack/react-query";
import { transactionKeys } from "@/features/transactions/api/TransactionQueryKeys";
import type { GetUserIncomeTotalRequest } from "@/features/transactions/api/TransactionRequest";
import { TransactionService } from "@/features/transactions/api/TransactionService";

export const useUserIncomeTotal = (req: GetUserIncomeTotalRequest) => {
	const { data, error, isLoading } = useQuery({
		queryKey: transactionKeys.incomeTotal(req),
		queryFn: () => TransactionService.getUserIncomeTotal(req),
		enabled: !!req.user_id,
	});

	return { error, incomeTotal: data ?? 0, isLoading };
};
