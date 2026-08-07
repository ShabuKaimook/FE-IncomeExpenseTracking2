import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { taxKeys } from "../api/TaxQueryKeys";
import type {
	TaxDeductionRequest,
	TaxEstimateRequest,
} from "../api/TaxRequest";
import { TaxService } from "../api/TaxService";

export const useIncomeByType = () => {
	const { data, error, isLoading } = useQuery({
		queryFn: TaxService.getIncomeByType,
		queryKey: taxKeys.incomeByType(),
	});

	return { error, incomeByType: data ?? [], isLoading };
};

export const useTaxDeductions = () => {
	const { data, error, isLoading } = useQuery({
		queryFn: TaxService.getDeductions,
		queryKey: taxKeys.deductions(),
	});

	return { deductions: data ?? {}, error, isLoading };
};

export const useSaveTaxDeductions = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (body: TaxDeductionRequest) => TaxService.saveDeductions(body),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: taxKeys.deductions() });
		},
	});
};

export const useTaxEstimate = () =>
	useMutation({
		mutationFn: (body: TaxEstimateRequest) => TaxService.estimate(body),
	});
