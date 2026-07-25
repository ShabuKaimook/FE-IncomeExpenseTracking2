import { axiosInstance } from "@/shared/api/AxiosInstance";
import type {
	CreateUserTransactionCategoryRequest,
	DeleteUserTransactionCategoryRequest,
	GetUserTransactionCategoryAmountsRequest,
	GetUserTransactionCategorySummaryRequest,
	UpdateUserTransactionCategoryRequest,
} from "./UserTransactionCategoryRequest";
import type {
	GetTransactionCategorySummaryResponse,
	UserTransactionCategoryAmountResponse,
	UserTransactionCategoryResponse,
} from "./UserTransactionCategoryResponse";

export const UserTransactionCategoryService = {
	getUserTransactionCategories: async (): Promise<
		UserTransactionCategoryResponse[]
	> => {
		const response = await axiosInstance.get<UserTransactionCategoryResponse[]>(
			"/user-transaction-category/me",
		);

		return response.data;
	},

	getUserTransactionCategoryAmounts: async (
		req: GetUserTransactionCategoryAmountsRequest,
	): Promise<UserTransactionCategoryAmountResponse[]> => {
		const response = await axiosInstance.post<
			UserTransactionCategoryAmountResponse[]
		>("/user-transaction-category/me/amount-summary", req);

		return response.data;
	},

	getUserTransactionCategorySummary: async (
		req: GetUserTransactionCategorySummaryRequest,
	): Promise<GetTransactionCategorySummaryResponse[]> => {
		const response = await axiosInstance.post<
			GetTransactionCategorySummaryResponse[]
		>("/user-transaction-category/summary", req);

		return response.data;
	},

	createUserTransactionCategory: async (
		body: CreateUserTransactionCategoryRequest,
	): Promise<void> => {
		await axiosInstance.post("/user-transaction-category/create", body);
	},

	updateUserTransactionCategory: async (
		userTransactionCategoryId: string,
		body: UpdateUserTransactionCategoryRequest,
	): Promise<void> => {
		await axiosInstance.patch(
			`/user-transaction-category/${userTransactionCategoryId}`,
			body,
		);
	},

	deleteUserTransactionCategory: async (
		body: DeleteUserTransactionCategoryRequest,
	): Promise<void> => {
		await axiosInstance.delete("/user-transaction-category/delete", {
			data: body,
		});
	},
};
