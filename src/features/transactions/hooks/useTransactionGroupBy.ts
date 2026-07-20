import { useInfiniteQuery } from "@tanstack/react-query";
import { transactionKeys } from "@/features/transactions/api/TransactionQueryKeys";
import type { GetTransactionGroupByRequest } from "@/features/transactions/api/TransactionRequest";
import { TransactionService } from "@/features/transactions/api/TransactionService";

const DEFAULT_LIMIT = 20;

type InfiniteTransactionGroupByRequest = Omit<
	GetTransactionGroupByRequest,
	"pagination"
> & {
	pagination?: {
		limit?: number;
	};
};

export const useTransactionGroupBy = (
	req: InfiniteTransactionGroupByRequest,
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
		queryKey: transactionKeys.groupBy(queryReq),
		queryFn: ({ pageParam }) =>
			TransactionService.getTransactionGroupBy({
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
		groups: data?.pages.flat() ?? [],
		hasNextPage,
		isFetchingNextPage,
		isLoading,
	};
};
