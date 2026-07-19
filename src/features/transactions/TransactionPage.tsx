import { ListFilter } from "lucide-react";
import { useMemo, useState } from "react";
import { useUserTransactions } from "@/features/transactions/hooks/useUserTransactions";
import { TransactionCard } from "@/features/transactions/components/TransactionCard";
import type { Transaction } from "@/features/transactions/components/TransactionCard";
import { TransactionListSkeleton } from "@/shared/components/Skeleton";
import { SearchBar } from "@/shared/components/SearchBar";
import { TRANSACTION_TYPE } from "@/shared/constants/TransactionTypeEnum";
import {
  DateRangeWithShowDisabledNavigation,
  type DatePickerRange,
} from "@/shared/components/DatePicker";
import { getThisMonthDateRange } from "@/shared/utils/Month";
import NewTransactionButton from "./components/NewTransactionButton";
import TransactionSortByDropdown from "./components/TransactionSortByDropdown";
import TransactionGroupByDropdown from "./components/TransactionGroupByDropdown";
import type {
  TransactionGroupBy,
  TransactionGroupDirection,
} from "./components/TransactionGroupByDropdown";

type SortBy = "description" | "amount" | "date";
type SortOrder = "asc" | "desc";

const toMonthValue = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

const fromMonthValue = (monthValue: string) => {
  const [year, month] = monthValue.split("-").map(Number);

  return new Date(year, month - 1, 1);
};

const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

const endOfDay = (date: Date) =>
  new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    23,
    59,
    59,
    999,
  );

const mapTransaction = (transaction: {
  transaction_id: string;
  transaction_type_id: number;
  transaction_type_name: string;
  transaction_category_name: string;
  amount: number;
  currency_code: string;
  description: string;
  date: string;
}): Transaction => ({
  id: transaction.transaction_id,
  date: transaction.date,
  description: transaction.description,
  amount: transaction.amount,
  currency: transaction.currency_code,
  category: transaction.transaction_category_name,
  type_id:
    transaction.transaction_type_id === TRANSACTION_TYPE.INCOME.id
      ? TRANSACTION_TYPE.INCOME.id
      : TRANSACTION_TYPE.EXPENSE.id,
  type_name: transaction.transaction_type_name,
});

const getGroupLabel = (
  transaction: Transaction,
  groupBy: TransactionGroupBy,
) => {
  if (groupBy === "category") {
    return transaction.category;
  }

  if (groupBy === "type") {
    return transaction.type_name;
  }

  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(transaction.date));
};

const compareTransactions = (sortBy: SortBy, sortOrder: SortOrder) => {
  const direction = sortOrder === "asc" ? 1 : -1;

  return (a: Transaction, b: Transaction) => {
    if (sortBy === "amount") {
      return (a.amount - b.amount) * direction;
    }

    if (sortBy === "date") {
      return (
        (new Date(a.date).getTime() - new Date(b.date).getTime()) * direction
      );
    }

    return a.description.localeCompare(b.description) * direction;
  };
};

const compareGroupLabels = (
  groupBy: TransactionGroupBy,
  direction: TransactionGroupDirection,
) => {
  const multiplier = direction === "asc" ? 1 : -1;

  return (
    [labelA]: [string, Transaction[]],
    [labelB]: [string, Transaction[]],
  ) => {
    if (groupBy === "date") {
      return (
        (new Date(labelA).getTime() - new Date(labelB).getTime()) * multiplier
      );
    }

    return labelA.localeCompare(labelB) * multiplier;
  };
};

export default function TransactionPage() {
  const initialRange = getThisMonthDateRange(new Date());
  const [selectedMonth, setSelectedMonth] = useState(toMonthValue(new Date()));
  const [dateRange, setDateRange] = useState<DatePickerRange>({
    mode: "month",
    startDate: initialRange.startDate,
    endDate: initialRange.endDate,
  });
  const [search, setSearch] = useState("");
  const [groupBy, setGroupBy] = useState<TransactionGroupBy>("date");
  const [groupDirection, setGroupDirection] =
    useState<TransactionGroupDirection>("desc");
  const [sortBy, setSortBy] = useState<SortBy>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const { transactions, isLoading, error } = useUserTransactions({
    pagination: { limit: 100, offset: 0 },
  });

  const groups = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    const rows = transactions
      .map(mapTransaction)
      .filter((transaction) => {
        if (!dateRange.startDate || !dateRange.endDate) {
          return true;
        }

        const transactionDate = new Date(transaction.date);
        const rangeStartDate = startOfDay(dateRange.startDate);
        const rangeEndDate = endOfDay(dateRange.endDate);
        return (
          transactionDate >= rangeStartDate && transactionDate <= rangeEndDate
        );
      })
      .filter((transaction) =>
        transaction.description.toLowerCase().includes(normalizedSearch),
      )
      .sort(compareTransactions(sortBy, sortOrder));

    return rows.reduce<Record<string, Transaction[]>>((acc, transaction) => {
      const label = getGroupLabel(transaction, groupBy);
      acc[label] = [...(acc[label] ?? []), transaction];
      return acc;
    }, {});
  }, [dateRange, groupBy, search, sortBy, sortOrder, transactions]);

  const sortedGroups = useMemo(
    () =>
      Object.entries(groups).sort(compareGroupLabels(groupBy, groupDirection)),
    [groupBy, groupDirection, groups],
  );

  return (
    <div className="flex flex-col gap-4 relative">
      <section className="z-30 rounded-xl">
        {/* First Section -> Date picker + New transaction */}
        <div className="flex flex-col gap-3 sm:flex-row lg:items-center lg:justify-between">
          <DateRangeWithShowDisabledNavigation
            value={fromMonthValue(selectedMonth)}
            onChange={(date) => {
              if (date) {
                setSelectedMonth(toMonthValue(date));
              }
            }}
            onRangeChange={setDateRange}
            className="lg:w-72"
          />

          <NewTransactionButton />
        </div>

        {/* Second Section -> Search, Group by, Sort By (TODO: add filter) */}
        <div className="mt-4 grid gap-3 md:grid-cols-[minmax(0,1.4fr)_minmax(190px,0.7fr)_minmax(220px,0.9fr)]">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search description"
            label="Search description"
          />

          <div className="flex w-full min-w-0 gap-3 md:col-span-2">
            <TransactionGroupByDropdown
              value={groupBy}
              direction={groupDirection}
              onChange={setGroupBy}
              onDirectionChange={setGroupDirection}
              className="flex-1"
            />

            <TransactionSortByDropdown
              value={sortBy}
              direction={sortOrder}
              onChange={setSortBy}
              onDirectionChange={setSortOrder}
              className="flex-1"
            />
          </div>
        </div>
      </section>

      <section className="relative z-0 rounded-xl border border-(--line) bg-(--surface) p-4 shadow-sm backdrop-blur">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ListFilter size={17} className="text-primary" />
            <h1 className="text-base font-semibold text-foreground">
              Transaction history
            </h1>
          </div>
          <span className="text-xs text-muted-foreground">
            {Object.values(groups).reduce(
              (count, rows) => count + rows.length,
              0,
            )}{" "}
            items
          </span>
        </div>

        {isLoading ? (
          <TransactionListSkeleton items={8} />
        ) : error ? (
          <div className="flex min-h-32 items-center justify-center rounded-lg border border-destructive/20 bg-destructive/5 text-sm text-destructive">
            Unable to load transactions.
          </div>
        ) : sortedGroups.length === 0 ? (
          <div className="flex min-h-32 items-center justify-center rounded-lg border border-(--line) bg-(--surface-strong) text-sm text-muted-foreground">
            No transactions match these filters.
          </div>
        ) : (
          <div className="space-y-5">
            {sortedGroups.map(([label, rows]) => (
              <div key={label} className="space-y-2">
                <div className="flex items-center justify-between border-b border-(--line) pb-2">
                  <h2 className="text-sm font-semibold text-foreground">
                    {label}
                  </h2>
                  <span className="text-xs text-muted-foreground">
                    {rows.length} records
                  </span>
                </div>
                <TransactionCard transactions={rows} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
