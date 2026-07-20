export interface UserTransactionCategoryResponse {
	user_transaction_category_id: string;
	user_transaction_category_name: string;
	transaction_type_id: number;
}

export interface GetTransactionCategorySummaryResponse {
	user_transaction_category_id: string;
	user_transaction_category_name: string;
	transaction_type_id: number;
	transaction_type_name: string;
	amount: number;
}
