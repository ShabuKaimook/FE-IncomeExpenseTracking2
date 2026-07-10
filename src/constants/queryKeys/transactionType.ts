import type { GetTransactionTypesRequest } from "@/services/TransactionTypeService/types/TransactionTypeRequest";

export const transactionTypeKeys = {
	all: ["transaction-types"] as const,
	lists: () => [...transactionTypeKeys.all, "list"] as const,
	list: (filter?: GetTransactionTypesRequest) =>
		[...transactionTypeKeys.lists(), filter ?? {}] as const,
};
