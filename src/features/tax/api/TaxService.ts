import { axiosInstance } from "@/shared/api/AxiosInstance";
import type { TaxDeductionRequest, TaxEstimateRequest } from "./TaxRequest";
import type {
	IncomeByTypeResponse,
	TaxDeductionResponse,
	TaxEstimateResponse,
} from "./TaxResponse";

export const TaxService = {
	getIncomeByType: async (): Promise<IncomeByTypeResponse[]> => {
		const response = await axiosInstance.get<IncomeByTypeResponse[]>(
			"/tax/income-by-type",
		);

		return response.data;
	},

	getDeductions: async (): Promise<TaxDeductionResponse> => {
		const response =
			await axiosInstance.get<TaxDeductionResponse>("/tax/deductions");

		return response.data;
	},

	saveDeductions: async (body: TaxDeductionRequest): Promise<void> => {
		await axiosInstance.post("/tax/deductions", body);
	},

	estimate: async (body: TaxEstimateRequest): Promise<TaxEstimateResponse> => {
		const response = await axiosInstance.post<TaxEstimateResponse>(
			"/tax/estimate",
			body,
		);

		return response.data;
	},
};
