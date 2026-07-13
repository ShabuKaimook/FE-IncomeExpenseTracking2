import { useQuery } from "@tanstack/react-query";
import { userTransactionCategoryKeys } from "#/constants/queryKeys/userTransactionCategory";
import { UserTransactionCategoryService } from "#/services/UserTransactionCategoryService";
import type { GetUserTransactionCategorySummaryRequest } from "@/services/UserTransactionCategoryService/types/UserTransactionCategoryRequest";
import type { GetTransactionCategorySummaryResponse } from "@/services/UserTransactionCategoryService/types/UserTransactionCategoryResponse";

export function useUserTransactionCategorySummary(
  req: GetUserTransactionCategorySummaryRequest,
) {
  const { data, error, isLoading } = useQuery<
    GetTransactionCategorySummaryResponse[]
  >({
    queryKey: userTransactionCategoryKeys.summary(req),
    queryFn: () =>
      UserTransactionCategoryService.getUserTransactionCategorySummary(req),
    enabled: !!req.user_id,
  });

  return { summary: data ?? [], error, isLoading };
}
