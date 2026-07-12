import { useQuery } from "@tanstack/react-query";
import { transactionKeys } from "@/constants/queryKeys/transaction";
import { TransactionService } from "@/services/TransactionService";
import type { GetUserSavingRateRequest } from "@/services/TransactionService/types/TransactionRequest";

export const useUserSavingRate = (req: GetUserSavingRateRequest) => {
	const { data, error, isLoading } = useQuery({
		queryKey: transactionKeys.savingRate(req),
		queryFn: () => TransactionService.getUserSavingRate(req),
		enabled: !!req.user_id,
	});

	return { savingRate: data?.saving_rate ?? 0, error, isLoading };
};
