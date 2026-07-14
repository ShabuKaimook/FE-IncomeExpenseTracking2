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
	pagination?: {
		limit: number;
		offset: number;
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
