import { useQuery } from "@tanstack/react-query";
import { transactionKeys } from "@/constants/queryKeys/transaction";
import { TransactionService } from "@/services/TransactionService";
import type { GetUserExpenseSummaryRequest } from "@/services/TransactionService/types/TransactionRequest";

export const useUserExpenseSummary = (req: GetUserExpenseSummaryRequest) => {
  const { data, error, isLoading } = useQuery({
    queryKey: transactionKeys.expenseSummary(req),
    queryFn: () => TransactionService.getUserExpenseSummary(req),
    enabled: !!req.user_id,
  });
  return { expenseSummary: data, error, isLoading };
};