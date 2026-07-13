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
		const { user_id, ...body } = req;

		const response = await axiosInstance.post<TransactionResponse[]>(
			`${TRANSACTION_PREFIX}/user/${user_id}`,
			body,
		);

		return response.data;
	},

	getUserIncomeTotal: async (
		req: GetUserIncomeTotalRequest,
	): Promise<number> => {
		const { user_id, ...body } = req;

		const response = await axiosInstance.post<number>(
			`${TRANSACTION_PREFIX}/user/${user_id}/income`,
			body,
		);

		return response.data;
	},

	getUserExpenseTotal: async (
		req: GetUserExpenseTotalRequest,
	): Promise<number> => {
		const { user_id, ...body } = req;
		const response = await axiosInstance.post<number>(
			`${TRANSACTION_PREFIX}/user/${user_id}/expense`,
			body,
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
