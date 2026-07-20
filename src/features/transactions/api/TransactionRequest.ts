import type { PeriodMode } from "@/shared/constants/Period";
import type { Period } from "@/shared/types/Period";

export interface CreateTransactionRequest {
	amount: number;
	currency_code: "THB" | "USD";
	description: string;
	user_transaction_category_id: string;
	date: string;
}

export interface GetTransactionRequest {
	criteria?: {
		description?: string;
		transaction_type_id?: number;
		user_transaction_category_id?: string;
		user_transaction_category_ids?: string[];
		amount_range?: {
			range_start: number;
			range_end: number;
		};
		start_date?: string;
		end_date?: string;
	};
	group_by?: {
		field: "transaction_type_id" | "user_transaction_category_id" | "date";
		direction: "asc" | "desc";
	};
	order_by?: {
		field:
			| "transaction_type_id"
			| "user_transaction_category_id"
			| "date"
			| "amount"
			| "description";
		direction: "asc" | "desc";
	};
	pagination?: {
		limit: number;
		page: number;
	};
}

export interface GetTransactionGroupByRequest {
	group_by: "transaction_type_id" | "user_transaction_category_id" | "date";
	direction?: "asc" | "desc";
	criteria?: {
		description?: string;
		transaction_type_id?: number;
		user_transaction_category_id?: string;
		user_transaction_category_ids?: string[];
		amount_range?: {
			range_start: number;
			range_end: number;
		};
		start_date?: string;
		end_date?: string;
	};
	pagination?: {
		limit: number;
		page: number;
	};
}

export interface GetUserIncomeTotalRequest {
	criteria?: {
		start_date?: Date;
		end_date?: Date;
	};
}

export interface GetUserExpenseTotalRequest {
	criteria?: {
		start_date?: Date;
		end_date?: Date;
	};
}

export interface GetUserExpenseSummaryRequest {
	period_mode: PeriodMode;
	periods: Period[];
}

export interface GetUserSavingRateRequest {
	periods: Period[];
}
