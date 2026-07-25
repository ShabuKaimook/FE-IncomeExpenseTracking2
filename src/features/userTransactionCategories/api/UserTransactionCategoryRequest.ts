import type { Period } from "@/shared/types/Period";

export interface CreateUserTransactionCategoryRequest {
	transaction_category_name: string;
	transaction_type_id: number;
}

export interface DeleteUserTransactionCategoryRequest {
	user_transaction_category_id: string;
}

export interface UpdateUserTransactionCategoryRequest {
	transaction_category_name: string;
}

export interface GetUserTransactionCategorySummaryRequest {
	periods: Period[];
	criteria?: {
		transaction_type_ids?: number[];
		transaction_category_ids?: string[];
	};
}

export interface GetUserTransactionCategoryAmountsRequest {
	transaction_type_id: number;
	start_date?: string;
	end_date?: string;
	order_by?: {
		field: "amount" | "name";
		direction: "asc" | "desc";
	};
}
