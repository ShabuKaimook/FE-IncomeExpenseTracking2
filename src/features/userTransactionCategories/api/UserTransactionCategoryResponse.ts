export interface UserTransactionCategoryResponse {
	user_transaction_category_id: string;
	user_transaction_category_name: string;
	transaction_type_id: number;
	is_deletable: boolean;
	is_editable: boolean;
}

export interface GetTransactionCategorySummaryResponse {
	user_transaction_category_id: string;
	user_transaction_category_name: string;
	transaction_type_id: number;
	transaction_type_name: string;
	amount: number;
}

export interface UserTransactionCategoryAmountResponse {
	user_transaction_category_id: string;
	user_transaction_category_name: string;
	transaction_type_id: number;
	transaction_type_name: string;
	is_deletable: boolean;
	is_editable: boolean;
	amount: number;
}

export interface CategoryTrendResponse {
	month: string;
	user_transaction_category_id: string;
	transaction_category_name: string;
	total_amount: number;
}

export interface AverageTransactionSizeResponse {
	user_transaction_category_id: string;
	transaction_category_name: string;
	avg_amount: number;
	transaction_count: number;
}
