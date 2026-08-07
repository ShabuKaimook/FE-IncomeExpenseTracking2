import type { TaxEstimateRequest } from "./TaxRequest";

export const taxKeys = {
	all: ["tax"] as const,
	deductions: () => [...taxKeys.all, "deductions"] as const,
	estimate: (req: TaxEstimateRequest) =>
		[...taxKeys.all, "estimate", req] as const,
	incomeByType: () => [...taxKeys.all, "income-by-type"] as const,
};
