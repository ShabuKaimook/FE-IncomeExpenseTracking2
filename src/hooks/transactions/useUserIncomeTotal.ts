import { useQuery } from "@tanstack/react-query";
import type { GetUserIncomeTotalRequest } from "#/services/TransactionService/types/TransactionRequest";
import { transactionKeys } from "@/constants/queryKeys/transaction";
import { TransactionService } from "@/services/TransactionService";

export const useUserIncomeTotal = (req: GetUserIncomeTotalRequest) => {
	const { data, error, isLoading } = useQuery({
		queryKey: transactionKeys.incomeTotal(req),
		queryFn: () => TransactionService.getUserIncomeTotal(req),
		enabled: !!req.user_id,
	});

	return { error, incomeTotal: data ?? 0, isLoading };
};
