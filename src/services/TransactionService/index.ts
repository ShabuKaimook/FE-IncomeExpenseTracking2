import { axiosInstance } from "@/services/http/axiosInstance";
import type {
	CreateTransactionRequest,
	GetTransactionRequest,
	GetUserExpenseTotalRequest,
	GetUserIncomeTotalRequest,
} from "./types/TransactionRequest";
import type { TransactionResponse } from "./types/TransactionResponse";

export const TransactionService = {
	createTransaction: async (body: CreateTransactionRequest): Promise<void> => {
		await axiosInstance.post("/transaction/create", body);
	},

	getUserTransactions: async (
		req: GetTransactionRequest,
	): Promise<TransactionResponse[]> => {
		const { user_id, ...body } = req;

		const response = await axiosInstance.post<TransactionResponse[]>(
			`/transaction/user/${user_id}`,
			body,
		);

		return response.data;
	},

	getUserIncomeTotal: async (
		req: GetUserIncomeTotalRequest,
	): Promise<number> => {
		const { user_id, ...body } = req;

		const response = await axiosInstance.post<number>(
			`/transaction/user/${user_id}/income`,
			body,
		);

		return response.data;
	},

	getUserExpenseTotal: async (
		req: GetUserExpenseTotalRequest,
	): Promise<number> => {
		const { user_id, ...body } = req;
		const response = await axiosInstance.post<number>(
			`/transaction/user/${user_id}/expense`,
			body,
		);

		return response.data;
	},
};
