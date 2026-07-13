import type { Period } from "#/types/period";

export interface CreateUserTransactionCategoryRequest {
	user_id: string;
	transaction_category_name: string;
	transaction_type_id: number;
}

export interface DeleteUserTransactionCategoryRequest {
	user_id: string;
	user_transaction_category_id: string;
}

export interface GetUserTransactionCategorySummaryRequest {
	user_id: string;
  periods: Period[];
  criteria?: {
    transaction_type_ids?: number[];
    transaction_category_ids?: string[];
  };
}