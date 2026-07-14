import { axiosInstance } from "@/shared/api/AxiosInstance";
import type {
	CreateTransactionRequest,
	GetTransactionRequest,
	GetUserExpenseSummaryRequest,
	GetUserExpenseTotalRequest,
	GetUserIncomeTotalRequest,
	GetUserSavingRateRequest,
} from "./TransactionRequest";
import type {
	GetUserSavingRateResponse,
	GetUserTransactionSummaryResponse,
	TransactionResponse,
} from "./TransactionResponse";

const TRANSACTION_PREFIX = "/transaction";

export const TransactionService = {
	createTransaction: async (body: CreateTransactionRequest): Promise<void> => {
		await axiosInstance.post(`${TRANSACTION_PREFIX}/create`, body);
	},

	getUserTransactions: async (
		req: GetTransactionRequest,
	): Promise<TransactionResponse[]> => {
		const response = await axiosInstance.post<TransactionResponse[]>(
			`${TRANSACTION_PREFIX}/me`,
			req,
		);

		return response.data;
	},

	getUserIncomeTotal: async (
		req: GetUserIncomeTotalRequest,
	): Promise<number> => {
		const response = await axiosInstance.post<number>(
			`${TRANSACTION_PREFIX}/me/income`,
			req,
		);

		return response.data;
	},

	getUserExpenseTotal: async (
		req: GetUserExpenseTotalRequest,
	): Promise<number> => {
		const response = await axiosInstance.post<number>(
			`${TRANSACTION_PREFIX}/me/expense`,
			req,
		);

		return response.data;
	},

	getUserExpenseSummary: async (
		req: GetUserExpenseSummaryRequest,
	): Promise<GetUserTransactionSummaryResponse[]> => {
		const response = await axiosInstance.post<
			GetUserTransactionSummaryResponse[]
		>(`${TRANSACTION_PREFIX}/expense/summary`, req);

		return response.data;
	},

	getUserSavingRate: async (
		req: GetUserSavingRateRequest,
	): Promise<GetUserSavingRateResponse> => {
		const response = await axiosInstance.post<GetUserSavingRateResponse>(
			`${TRANSACTION_PREFIX}/saving-rate`,
			req,
		);

		return response.data;
	},
};
