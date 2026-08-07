import type {
	FixedVsVariableRequest,
	GetTransactionGroupByRequest,
	GetTransactionRequest,
	GetUserExpenseSummaryRequest,
	GetUserExpenseTotalRequest,
	GetUserIncomeTotalRequest,
	GetUserSavingRateRequest,
	RecurringTransactionsRequest,
	SpendingHeatmapRequest,
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
	savingRate: (req: GetUserSavingRateRequest) =>
		[...transactionKeys.all, "saving-rate", req] as const,
	spendingHeatmap: (req: SpendingHeatmapRequest) =>
		[...transactionKeys.all, "spending-heatmap", req] as const,
	fixedVsVariable: (req: FixedVsVariableRequest) =>
		[...transactionKeys.all, "fixed-vs-variable", req] as const,
	recurring: (req: RecurringTransactionsRequest) =>
		[...transactionKeys.all, "recurring", req] as const,
	lastUpdated: () => [...transactionKeys.all, "last-updated"] as const,
};
