export interface TransactionResponse {
	transaction_id: string;
	transaction_type_id: number;
	transaction_type_name: string;
	user_transaction_category_id: string;
	transaction_category_name: string;
	amount: number;
	currency_code: string;
	description: string;
	date: string;
}

export interface GetUserTransactionSummaryResponse {
	start_date: string;
	end_date: string;
	total_amount: number;
}

export interface GetUserSavingRateResponse {
	saving_rate: number;
}

export interface GetTransactionGroupByResponse {
	group_by_value: string | number;
	group_by_label: string;
	transaction_count: number;
}
