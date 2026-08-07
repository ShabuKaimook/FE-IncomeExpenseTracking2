export interface IncomeByTypeResponse {
	tax_type: string;
	tax_type_name: string;
	total_income: number;
}

export type TaxDeductionResponse = Record<string, number>;

export interface TaxBracketResponse {
	rate: number;
	range_end: number | null;
	range_start: number;
	tax: number;
	taxable_amount: number;
}

export interface TaxEstimateResponse {
	deduction_total: number;
	expense_total: number;
	gross_income: number;
	net_income: number;
	tax_due: number;
	brackets: TaxBracketResponse[];
}
