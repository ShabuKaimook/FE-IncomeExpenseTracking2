import { useQuery } from "@tanstack/react-query";
import { transactionKeys } from "@/features/transactions/api/TransactionQueryKeys";
import type { GetUserSavingRateRequest } from "@/features/transactions/api/TransactionRequest";
import { TransactionService } from "@/features/transactions/api/TransactionService";

export const useUserSavingRate = (req: GetUserSavingRateRequest) => {
	const { data, error, isLoading } = useQuery({
		queryKey: transactionKeys.savingRate(req),
		queryFn: () => TransactionService.getUserSavingRate(req),
	});

	return { savingRate: data?.saving_rate ?? 0, error, isLoading };
};
