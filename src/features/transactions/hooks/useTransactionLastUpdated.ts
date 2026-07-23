import { useQuery } from "@tanstack/react-query";
import { transactionKeys } from "@/features/transactions/api/TransactionQueryKeys";
import { TransactionService } from "@/features/transactions/api/TransactionService";

export const useTransactionLastUpdated = () => {
	const { data, error, isLoading } = useQuery({
		queryKey: transactionKeys.lastUpdated(),
		queryFn: () => TransactionService.getTransactionLastUpdated(),
	});

	return {
		lastUpdated: data?.last_updated,
		error,
		isLoading,
	};
};
