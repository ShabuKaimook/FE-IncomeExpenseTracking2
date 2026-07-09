import { TRANSACTION_TYPE } from "@/constants/TransactionType.enum";

type TransactionTypeId =
  (typeof TRANSACTION_TYPE)[keyof typeof TRANSACTION_TYPE]["id"];
type TransactionTypeName =
  (typeof TRANSACTION_TYPE)[keyof typeof TRANSACTION_TYPE]["name"];

export interface Transaction {
  id: number;
  date: string;
  description: string;
  amount: number;
  currency: string;
  category: string;
  type_id: TransactionTypeId;
  type_name: TransactionTypeName;
}

interface TransactionCardProps {
  transactions: Transaction[];
}

const formatAmount = (transaction: Transaction) => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: transaction.currency,
  });

  return `${transaction.type_id === TRANSACTION_TYPE.INCOME.id ? "+" : "-"}${formatter.format(
    transaction.amount,
  )}`;
};

export const TransactionCard = ({ transactions }: TransactionCardProps) => {
  return (
    <>
      {transactions.length === 0 ? (
        <div className="flex min-h-24 w-full items-center justify-center">
          <span className="text-sm text-muted-foreground">
            No transactions available
          </span>
        </div>
      ) : (
        <div className="flex w-full flex-col gap-2">
          {transactions.map((transaction) => {
            const isIncome = transaction.type_id === TRANSACTION_TYPE.INCOME.id;
            const typeLabel = isIncome ? "Income" : "Expense";

            return (
              <article
                key={transaction.id}
                aria-label={`${typeLabel}: ${transaction.description}`}
                className={`group relative flex w-full items-center justify-between gap-3 overflow-hidden rounded-lg border bg-background/70 px-3 py-3 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-background/90 hover:shadow-md ${
                  isIncome ? "border-primary/20" : "border-destructive/20"
                }`}
              >
                <span
                  className={`absolute inset-y-0 left-0 w-1 ${
                    isIncome ? "bg-primary" : "bg-destructive"
                  }`}
                  aria-hidden="true"
                />

                <div className="flex min-w-0 items-center gap-3">
                  <div className="min-w-0">
                    <div className="flex min-w-0 items-center gap-2">
                      <span className={`w-2 h-2 rounded-full bg-${isIncome ? "primary" : "destructive"}`}></span>
                      <p className="truncate text-sm font-semibold text-foreground">
                        {transaction.category}
                      </p>
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                          isIncome
                            ? "bg-primary/10 text-primary"
                            : "bg-destructive/10 text-destructive"
                        }`}
                      >
                        {typeLabel}
                      </span>
                    </div>
                    <div className="mt-1 flex flex-col flex-wrap gap-1 text-xs text-muted-foreground sm:gap-2 pl-4">
                      <span className="text-muted-foreground text-sm font-medium">
                        {transaction.description}
                      </span>
                      <span className="text-neutral-400 text-xs">{transaction.date}</span>
                    </div>
                  </div>
                </div>

                <span
                  className={`shrink-0 rounded-md px-2 py-1 text-right text-sm font-bold tabular-nums ${
                    isIncome ? "text-primary" : "text-destructive"
                  }`}
                >
                  {formatAmount(transaction)}
                </span>
              </article>
            );
          })}
        </div>
      )}
    </>
  );
};
