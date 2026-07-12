import { Link } from "@tanstack/react-router";
import { WalletCards } from "lucide-react";
import { DashboardCard } from "#/components/DashboardCard";
import { LoadingSpinner } from "#/components/LoadingSpinner";
import { TransactionCard } from "#/components/TransactionCard";
import { useUserTransactions } from "#/hooks/transactions/useUserTransactions";
import { MOCK_USER_ID } from "#/constants/user";
import { useMemo, useEffect } from "react";
import { toast } from "react-toastify";
import { TRANSACTION_TYPE } from "#/constants/TransactionType.enum";
import type { TransactionResponse } from "#/services/TransactionService/types/TransactionResponse";
import type { Transaction } from "#/components/TransactionCard";

const mapTransaction = (transaction: TransactionResponse): Transaction => {
  const isIncome =
    transaction.transaction_type_id === TRANSACTION_TYPE.INCOME.id;

  return {
    id: transaction.transaction_id,
    date: transaction.date,
    description: transaction.description,
    amount: transaction.amount,
    currency: transaction.currency_code,
    category: transaction.transaction_category_name,
    type_id: isIncome
      ? TRANSACTION_TYPE.INCOME.id
      : TRANSACTION_TYPE.EXPENSE.id,
    type_name: transaction.transaction_type_name,
  };
};

export const TransactionHistoryDashboardCard = () => {
  const {
    error: transactionsError,
    isLoading: isTransactionsLoading,
    transactions,
  } = useUserTransactions({
    user_id: MOCK_USER_ID,
    pagination: { limit: 5, offset: 0 },
  });

  const transactionHistoryData = useMemo(
    () => transactions.map(mapTransaction),
    [transactions],
  );
  
  useEffect(() => {
    if (transactionsError) {
      toast.error("Failed to load transactions");
    }
  }, [transactionsError]);
  
  return (
    <DashboardCard
      header={{
        icon: <WalletCards size={16} className="text-primary" />,
        title: "TRANSACTION HISTORY",
      }}
      rightSide={
        <div className="flex items-center gap-2 text-xs lg:text-sm bg-primary/20 px-3 py-1 rounded-2xl">
          {/* TODO: link the path */}
          <Link to="/transaction" className="text-primary cursor-pointer">
            <span className="text-primary cursor-pointer">View More</span>
          </Link>
        </div>
      }
    >
      {isTransactionsLoading ? (
        <div className="flex min-h-24 w-full items-center justify-center">
          <LoadingSpinner
            className="text-muted-foreground"
            label="Loading transactions"
            size={24}
          />
        </div>
      ) : (
        <TransactionCard transactions={transactionHistoryData} />
      )}
    </DashboardCard>
  );
};
