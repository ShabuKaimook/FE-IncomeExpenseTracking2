import type { GetUserTransactionCategorySummaryRequest } from "@/features/userTransactionCategories/api/UserTransactionCategoryRequest";

export const userTransactionCategoryKeys = {
	all: ["user-transaction-categories"] as const,
	lists: () => [...userTransactionCategoryKeys.all, "list"] as const,
	list: (userId: string) =>
		[...userTransactionCategoryKeys.lists(), userId] as const,
	summary: (req: GetUserTransactionCategorySummaryRequest) =>
		[...userTransactionCategoryKeys.all, "summary", req] as const,
};
