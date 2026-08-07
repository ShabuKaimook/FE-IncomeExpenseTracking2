export type TaxDeductionRequest = Record<string, number>;

export interface TaxEstimateRequest {
	deductions: TaxDeductionRequest;
}
