import type { GetTransactionTypesRequest } from "@/features/transactionTypes/api/TransactionTypeRequest";

export const transactionTypeKeys = {
	all: ["transaction-types"] as const,
	lists: () => [...transactionTypeKeys.all, "list"] as const,
	list: (filter?: GetTransactionTypesRequest) =>
		[...transactionTypeKeys.lists(), filter ?? {}] as const,
};
