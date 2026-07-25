import type {
	GetUserTransactionCategoryAmountsRequest,
	GetUserTransactionCategorySummaryRequest,
} from "@/features/userTransactionCategories/api/UserTransactionCategoryRequest";

export const userTransactionCategoryKeys = {
	all: ["user-transaction-categories"] as const,
	lists: () => [...userTransactionCategoryKeys.all, "list"] as const,
	list: () => [...userTransactionCategoryKeys.lists(), "me"] as const,
	summary: (req: GetUserTransactionCategorySummaryRequest) =>
		[...userTransactionCategoryKeys.all, "summary", req] as const,
	amounts: (req: GetUserTransactionCategoryAmountsRequest) =>
		[...userTransactionCategoryKeys.all, "amounts", req] as const,
};
