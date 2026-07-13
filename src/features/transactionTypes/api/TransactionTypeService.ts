import { axiosInstance } from "@/shared/api/AxiosInstance";
import type { GetTransactionTypesRequest } from "./TransactionTypeRequest";
import type { TransactionTypeResponse } from "./TransactionTypeResponse";

export const TransactionTypeService = {
	getTransactionTypes: async (
		body: GetTransactionTypesRequest = {},
	): Promise<TransactionTypeResponse[]> => {
		const response = await axiosInstance.post<TransactionTypeResponse[]>(
			"/transaction-type/",
			body,
		);

		return response.data;
	},
};
