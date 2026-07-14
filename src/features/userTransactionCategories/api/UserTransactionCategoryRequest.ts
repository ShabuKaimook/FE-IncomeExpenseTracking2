import type { Period } from "@/shared/types/Period";

export interface CreateUserTransactionCategoryRequest {
	transaction_category_name: string;
	transaction_type_id: number;
}

export interface DeleteUserTransactionCategoryRequest {
	user_transaction_category_id: string;
}

export interface GetUserTransactionCategorySummaryRequest {
	periods: Period[];
	criteria?: {
		transaction_type_ids?: number[];
		transaction_category_ids?: string[];
	};
}
