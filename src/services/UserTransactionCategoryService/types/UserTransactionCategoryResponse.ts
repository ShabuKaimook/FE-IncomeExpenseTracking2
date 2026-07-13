export interface UserTransactionCategoryResponse {
	transaction_type_id: number;
	transaction_category_id: string;
	transaction_category_name: string;
}

export interface GetTransactionCategorySummaryResponse {
  transaction_category_id: string;
  transaction_category_name: string;
  transaction_type_id: number;
  transaction_type_name: string;
  amount: number;
}