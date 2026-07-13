import { axiosInstance } from "@/services/http/axiosInstance";
import type {
  CreateUserTransactionCategoryRequest,
  DeleteUserTransactionCategoryRequest,
  GetUserTransactionCategorySummaryRequest,
} from "./types/UserTransactionCategoryRequest";
import type {
  UserTransactionCategoryResponse,
  GetTransactionCategorySummaryResponse,
} from "./types/UserTransactionCategoryResponse";

export const UserTransactionCategoryService = {
  getUserTransactionCategories: async (
    userId: string,
  ): Promise<UserTransactionCategoryResponse[]> => {
    const response = await axiosInstance.get<UserTransactionCategoryResponse[]>(
      `/user-transaction-category/${userId}`,
    );

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

  deleteUserTransactionCategory: async (
    body: DeleteUserTransactionCategoryRequest,
  ): Promise<void> => {
    await axiosInstance.delete("/user-transaction-category/delete", {
      data: body,
    });
  },
};
