import { useQuery } from "@tanstack/react-query";
import { transactionKeys } from "@/features/transactions/api/TransactionQueryKeys";
import type { GetTransactionBalanceSummaryRequest } from "@/features/transactions/api/TransactionRequest";
import { TransactionService } from "@/features/transactions/api/TransactionService";

const emptyBalanceSummary = {
	start_date: "",
	end_date: "",
	income: 0,
	expense: 0,
	net_balance: 0,
};

export const useTransactionBalanceSummary = (
	req: GetTransactionBalanceSummaryRequest,
) => {
	const { data, error, isLoading } = useQuery({
		queryKey: transactionKeys.balanceSummary(req),
		queryFn: () => TransactionService.getTransactionBalanceSummary(req),
	});

	return {
		balanceSummary: data?.[0] ?? emptyBalanceSummary,
		error,
		isLoading,
	};
};
