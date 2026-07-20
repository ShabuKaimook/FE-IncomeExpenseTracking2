import { useInfiniteQuery } from "@tanstack/react-query";
import { transactionKeys } from "@/features/transactions/api/TransactionQueryKeys";
import type { GetTransactionRequest } from "@/features/transactions/api/TransactionRequest";
import { TransactionService } from "@/features/transactions/api/TransactionService";

const DEFAULT_LIMIT = 30;

type InfiniteTransactionRequest = Omit<GetTransactionRequest, "pagination"> & {
	pagination?: {
		limit?: number;
	};
};

export const useInfiniteUserTransactions = (
	req: InfiniteTransactionRequest,
	enabled = true,
) => {
	const limit = req.pagination?.limit ?? DEFAULT_LIMIT;
	const queryReq = {
		...req,
		pagination: { limit },
	};

	const {
		data,
		error,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
	} = useInfiniteQuery({
		queryKey: transactionKeys.list(queryReq),
		queryFn: ({ pageParam }) =>
			TransactionService.getUserTransactions({
				...req,
				pagination: {
					limit,
					page: pageParam,
				},
			}),
		initialPageParam: 0,
		getNextPageParam: (lastPage, _allPages, lastPageParam) =>
			lastPage.length >= limit ? lastPageParam + 1 : undefined,
		enabled,
	});

	return {
		error,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		transactions: data?.pages.flat() ?? [],
	};
};
