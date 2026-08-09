import type {
	GetTransactionBalanceSummaryRequest,
	GetTransactionGroupByRequest,
	GetTransactionIncomeSummaryRequest,
	GetTransactionRequest,
	GetTransactionSummaryRequest,
	GetUserExpenseSummaryRequest,
	GetUserExpenseTotalRequest,
	GetUserIncomeTotalRequest,
	GetUserSavingRateRequest,
} from "@/features/transactions/api/TransactionRequest";

export const transactionKeys = {
	all: ["transactions"] as const,
	lists: () => [...transactionKeys.all, "list"] as const,
	list: (req: GetTransactionRequest) =>
		[...transactionKeys.lists(), req] as const,
	groupBy: (req: GetTransactionGroupByRequest) =>
		[...transactionKeys.all, "group-by", req] as const,
	incomeTotal: (req: GetUserIncomeTotalRequest) =>
		[...transactionKeys.all, "income-total", req] as const,
	expenseTotal: (req: GetUserExpenseTotalRequest) =>
		[...transactionKeys.all, "expense-total", req] as const,
	expenseSummary: (req: GetUserExpenseSummaryRequest) =>
		[...transactionKeys.all, "expense-summary", req] as const,
	incomeSummary: (req: GetTransactionIncomeSummaryRequest) =>
		[...transactionKeys.all, "income-summary", req] as const,
	transactionSummary: (req: GetTransactionSummaryRequest) =>
		[...transactionKeys.all, "summary", req] as const,
	balanceSummary: (req: GetTransactionBalanceSummaryRequest) =>
		[...transactionKeys.all, "balance-summary", req] as const,
	savingRate: (req: GetUserSavingRateRequest) =>
		[...transactionKeys.all, "saving-rate", req] as const,
	lastUpdated: () => [...transactionKeys.all, "last-updated"] as const,
};
