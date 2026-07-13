import { useQuery } from "@tanstack/react-query";
import { transactionTypeKeys } from "@/features/transactionTypes/api/TransactionTypeQueryKeys";
import type { GetTransactionTypesRequest } from "@/features/transactionTypes/api/TransactionTypeRequest";
import { TransactionTypeService } from "@/features/transactionTypes/api/TransactionTypeService";

export const useTransactionTypes = (filter?: GetTransactionTypesRequest) => {
	const { data, error, isLoading } = useQuery({
		queryKey: transactionTypeKeys.list(filter),
		queryFn: () => TransactionTypeService.getTransactionTypes(filter),
	});

	return { transactionTypes: data ?? [], error, isLoading };
};
