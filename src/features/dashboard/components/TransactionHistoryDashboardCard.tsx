import { Link } from "@tanstack/react-router";
import { WalletCards } from "lucide-react";
import { useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import type { TransactionResponse } from "@/features/transactions/api/TransactionResponse";
import type { Transaction } from "@/features/transactions/components/TransactionCard";
import { TransactionCard } from "@/features/transactions/components/TransactionCard";
import { DashboardCard } from "@/shared/components/DashboardCard";
import { TransactionListSkeleton } from "@/shared/components/Skeleton";
import { TRANSACTION_TYPE } from "@/shared/constants/TransactionTypeEnum";

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

export const TransactionHistoryDashboardCard = ({
  transactions,
  isTransactionsLoading,
  transactionsError,
}: {
  transactions: TransactionResponse[];
  isTransactionsLoading: boolean;
  transactionsError: Error | null;
}) => {
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
        !isTransactionsLoading && (
          <div className="flex items-center gap-2 text-xs lg:text-sm bg-primary/20 px-3 py-1 rounded-2xl">
            {/* TODO: link the path */}
            <Link to="/transaction" className="text-primary cursor-pointer">
              <span className="text-primary cursor-pointer">View More</span>
            </Link>
          </div>
        )
      }
    >
      {isTransactionsLoading ? (
        <TransactionListSkeleton items={5} />
      ) : (
        <TransactionCard transactions={transactionHistoryData} />
      )}
    </DashboardCard>
  );
};
