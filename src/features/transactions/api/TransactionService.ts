import { axiosInstance } from "@/shared/api/AxiosInstance";
import type {
  CreateTransactionRequest,
  GetTransactionGroupByRequest,
  GetTransactionRequest,
  GetUserExpenseSummaryRequest,
  GetUserExpenseTotalRequest,
  GetUserIncomeTotalRequest,
  GetUserSavingRateRequest,
  UpdateTransactionRequest,
} from "./TransactionRequest";
import type {
  GetTransactionGroupByResponse,
  GetUserSavingRateResponse,
  GetUserTransactionSummaryResponse,
  TransactionDraftResponse,
  TransactionLastUpdatedResponse,
  TransactionResponse,
} from "./TransactionResponse";

const TRANSACTION_PREFIX = "/transaction";

export const TransactionService = {
  createTransaction: async (body: CreateTransactionRequest): Promise<void> => {
    await axiosInstance.post(`${TRANSACTION_PREFIX}/create`, body);
  },

  updateTransaction: async (
    transactionId: string,
    body: UpdateTransactionRequest,
  ): Promise<void> => {
    await axiosInstance.patch(`${TRANSACTION_PREFIX}/${transactionId}`, body);
  },

  deleteTransaction: async (transactionId: string): Promise<void> => {
    await axiosInstance.delete(`${TRANSACTION_PREFIX}/${transactionId}`);
  },

  createTransactionDraftFromImage: async (
    file: File,
  ): Promise<TransactionDraftResponse> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axiosInstance.post<TransactionDraftResponse>(
      `${TRANSACTION_PREFIX}/ai/draft/image`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data;
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

  getTransactionGroupBy: async (
    req: GetTransactionGroupByRequest,
  ): Promise<GetTransactionGroupByResponse[]> => {
    const response = await axiosInstance.post<GetTransactionGroupByResponse[]>(
      `${TRANSACTION_PREFIX}/group-by`,
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

  getTransactionLastUpdated:
    async (): Promise<TransactionLastUpdatedResponse> => {
      const response = await axiosInstance.get<TransactionLastUpdatedResponse>(
        `${TRANSACTION_PREFIX}/latest-updated`,
      );

      return response.data;
    },
};
