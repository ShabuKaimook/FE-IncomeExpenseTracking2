export interface CreateTransactionRequest {
	amount: number;
	currency_code: "THB" | "USD";
	description: string;
	user_id: string;
	user_transaction_category_id: string;
	date: string;
}

export interface GetTransactionRequest {
	user_id: string;
	pagination?: {
		limit: number;
		offset: number;
	};
}

export interface GetUserIncomeTotalRequest {
	user_id: string;
	criteria?: {
		start_date?: Date;
		end_date?: Date;
	};
}

export interface GetUserExpenseTotalRequest {
	user_id: string;
	criteria?: {
		start_date?: Date;
		end_date?: Date;
	};
}