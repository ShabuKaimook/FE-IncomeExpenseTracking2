import { Link } from "@tanstack/react-router";
import { Camera, ListFilter, Plus, ReceiptText, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useUserTransactions } from "@/features/transactions/hooks/useUserTransactions";
import { TransactionCard } from "@/features/transactions/components/TransactionCard";
import type { Transaction } from "@/features/transactions/components/TransactionCard";
import { CustomDropdown } from "@/features/transactions/components/CustomDropdown";
import { TransactionListSkeleton } from "@/shared/components/Skeleton";
import { TRANSACTION_TYPE } from "@/shared/constants/TransactionTypeEnum";
import {
  DateRangeWithShowDisabledNavigation,
  type DatePickerRange,
} from "@/shared/components/DatePicker";
import { getThisMonthDateRange } from "@/shared/utils/Month";
import { DropdownMenu } from "radix-ui";
import { Button } from "@radix-ui/themes";

type GroupBy = "date" | "category" | "type";
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

const getGroupLabel = (transaction: Transaction, groupBy: GroupBy) => {
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

export default function TransactionPage() {
  const initialRange = getThisMonthDateRange(new Date());
  const [selectedMonth, setSelectedMonth] = useState(toMonthValue(new Date()));
  const [dateRange, setDateRange] = useState<DatePickerRange>({
    mode: "month",
    startDate: initialRange.startDate,
    endDate: initialRange.endDate,
  });
  const [search, setSearch] = useState("");
  const [groupBy, setGroupBy] = useState<GroupBy>("date");
  const [sortBy, setSortBy] = useState<SortBy>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [isAddOpen, setIsAddOpen] = useState(false);
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

  return (
    <div className="flex flex-col gap-4 relative">
      <section className="relative z-30 rounded-xl">
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

          {/* <div className="relative">
						<button
							type="button"
							onClick={() => setIsAddOpen((current) => !current)}
							className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90 lg:w-auto"
							aria-expanded={isAddOpen}
						>
							<Plus size={18} />
							<p >New transaction</p>
						</button>

						{isAddOpen && (
							<div className="absolute right-0 z-20 mt-2 grid w-full min-w-56 gap-2 rounded-lg border border-(--line) bg-(--surface-strong) p-2 shadow-xl backdrop-blur lg:w-56">
								<Link
									to="/transaction/create"
									className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-foreground transition hover:bg-primary/10"
								>
									<ReceiptText size={16} />
									Manual add
								</Link>
								<a
									href="/transaction/create?mode=image"
									className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-foreground transition hover:bg-primary/10"
								>
									<Camera size={16} />
									Add by image
								</a>
							</div>
						)}
					</div> */}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger className="flex h-11 w-11 sm:w-60 items-center justify-center gap-2 rounded-full  sm:rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition cursor-pointer hover:opacity-90 ">
              <Plus size={17} />
              <p className="absolute hidden sm:inline sm:relative">New Transaction</p>
            </DropdownMenu.Trigger>
          </DropdownMenu.Root>
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1.4fr)_minmax(190px,0.7fr)_minmax(220px,0.9fr)]">
          <label className="flex h-11 min-w-0 items-center gap-3 rounded-lg border border-(--line) bg-(--surface-strong) px-3 text-sm shadow-sm">
            <Search size={17} className="text-muted-foreground" />
            <span className="sr-only">Search description</span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search description"
              className="w-full bg-transparent outline-none placeholder:text-muted-foreground"
            />
          </label>

          <CustomDropdown
            label="Group by"
            value={groupBy}
            onChange={(value) => setGroupBy(value as GroupBy)}
            sections={[
              {
                options: [
                  { label: "Date", value: "date" },
                  { label: "Transaction category", value: "category" },
                  { label: "Transaction type", value: "type" },
                ],
              },
            ]}
          />

          <CustomDropdown
            label="Sort"
            value={`${sortBy}:${sortOrder}`}
            onChange={(value) => {
              const [nextSortBy, nextSortOrder] = value.split(":");
              setSortBy(nextSortBy as SortBy);
              setSortOrder(nextSortOrder as SortOrder);
            }}
            sections={[
              {
                title: "Sort by",
                options: [
                  { label: "Description", value: "description:desc" },
                  { label: "Amount", value: "amount:desc" },
                  { label: "Date", value: "date:desc" },
                ],
              },
              {
                title: "Direction",
                options: [
                  { label: "Ascending", value: `${sortBy}:asc` },
                  { label: "Descending", value: `${sortBy}:desc` },
                ],
              },
            ]}
          />
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
        ) : Object.keys(groups).length === 0 ? (
          <div className="flex min-h-32 items-center justify-center rounded-lg border border-(--line) bg-(--surface-strong) text-sm text-muted-foreground">
            No transactions match these filters.
          </div>
        ) : (
          <div className="space-y-5">
            {Object.entries(groups).map(([label, rows]) => (
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
