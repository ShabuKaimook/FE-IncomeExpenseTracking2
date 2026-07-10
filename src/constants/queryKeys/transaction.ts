import type {
	GetTransactionRequest,
	GetUserExpenseTotalRequest,
	GetUserIncomeTotalRequest,
} from "#/services/TransactionService/types/TransactionRequest";

export const transactionKeys = {
	all: ["transactions"] as const,
	lists: () => [...transactionKeys.all, "list"] as const,
	list: (req: GetTransactionRequest) =>
		[...transactionKeys.lists(), req] as const,
	incomeTotal: (req: GetUserIncomeTotalRequest) =>
		[...transactionKeys.all, "income-total", req] as const,
	expenseTotal: (req: GetUserExpenseTotalRequest) =>
		[...transactionKeys.all, "expense-total", req] as const,
};
