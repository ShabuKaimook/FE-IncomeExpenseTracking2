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
