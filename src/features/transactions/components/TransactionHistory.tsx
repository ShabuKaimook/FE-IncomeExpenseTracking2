import { ChevronDown, ListFilter } from "lucide-react";
import { useMemo, useState } from "react";
import type { GetTransactionRequest } from "@/features/transactions/api/TransactionRequest";
import type { GetTransactionGroupByResponse } from "@/features/transactions/api/TransactionResponse";
import { useInfiniteUserTransactions } from "@/features/transactions/hooks/useInfiniteUserTransactions";
import { useTransactionGroupBy } from "@/features/transactions/hooks/useTransactionGroupBy";
import { TransactionListSkeleton } from "@/shared/components/Skeleton";
import { TRANSACTION_TYPE } from "@/shared/constants/TransactionTypeEnum";
import { useInfiniteScrollSentinel } from "@/shared/hooks/useInfiniteScrollSentinel";
import { type Transaction, TransactionCard } from "./TransactionCard";
import type {
	TransactionGroupBy,
	TransactionGroupDirection,
} from "./TransactionGroupByDropdown";
import type { TransactionSortBy } from "./TransactionSortByDropdown";

type SortDirection = "asc" | "desc";

const TRANSACTION_PAGE_LIMIT = 30;
const GROUP_BY_PAGE_LIMIT = 20;

const transactionGroupFieldByValue: Record<
	TransactionGroupBy,
	"transaction_type_id" | "user_transaction_category_id" | "date"
> = {
	category: "user_transaction_category_id",
	date: "date",
	type: "transaction_type_id",
};

const transactionSortFieldByValue: Record<
	TransactionSortBy,
	"description" | "amount" | "date"
> = {
	amount: "amount",
	date: "date",
	description: "description",
};

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

const getDateGroupLabel = (date: string) =>
	new Intl.DateTimeFormat("en-US", {
		day: "numeric",
		month: "short",
		year: "numeric",
	}).format(new Date(date));

const buildGroupCriteria = (
	baseCriteria: NonNullable<GetTransactionRequest["criteria"]>,
	groupBy: TransactionGroupBy,
	groupValue: string | number,
): GetTransactionRequest["criteria"] => {
	if (groupBy === "date") {
		const date = String(groupValue);
		return {
			...baseCriteria,
			start_date: date,
			end_date: date,
		};
	}

	if (groupBy === "type") {
		return {
			...baseCriteria,
			transaction_type_id: Number(groupValue),
		};
	}

	return {
		...baseCriteria,
		user_transaction_category_id: String(groupValue),
	};
};

interface TransactionGroupPanelProps {
	baseCriteria: NonNullable<GetTransactionRequest["criteria"]>;
	direction: SortDirection;
	group: GetTransactionGroupByResponse;
	groupBy: TransactionGroupBy;
	isOpen: boolean;
	onToggle: () => void;
	sortBy: TransactionSortBy;
}

const TransactionGroupPanel = ({
	baseCriteria,
	direction,
	group,
	groupBy,
	isOpen,
	onToggle,
	sortBy,
}: TransactionGroupPanelProps) => {
	const {
		error,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		transactions,
	} = useInfiniteUserTransactions(
		{
			criteria: buildGroupCriteria(baseCriteria, groupBy, group.group_by_value),
			order_by: {
				field: transactionSortFieldByValue[sortBy],
				direction,
			},
			pagination: { limit: TRANSACTION_PAGE_LIMIT },
		},
		isOpen,
	);
	const loadMoreGroupTransactionsRef = useInfiniteScrollSentinel({
		listMode: "infiniteScroll",
		isFetchingNextPage,
		onLoadMore: () => {
			void fetchNextPage();
		},
		hasNextPage,
		enabled: isOpen,
		rootMargin: "240px",
	});

	return (
		<div className="overflow-hidden rounded-lg border border-(--line) bg-background/60">
			<button
				type="button"
				onClick={onToggle}
				className="flex w-full items-center justify-between gap-3 px-3 py-3 text-left transition hover:bg-primary/5 focus-visible:outline-2 focus-visible:outline-primary"
			>
				<div className="flex min-w-0 items-center gap-2">
					<span className="truncate text-sm font-semibold text-foreground">
						{group.group_by_label}
					</span>
					<span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
						{group.transaction_count} records
					</span>
				</div>
				<ChevronDown
					size={17}
					className={`shrink-0 text-muted-foreground transition-transform duration-200 ${
						isOpen ? "rotate-180" : ""
					}`}
				/>
			</button>

			{isOpen ? (
				<div className="border-t border-(--line) p-3">
					{isLoading ? (
						<TransactionListSkeleton items={3} />
					) : error ? (
						<div className="flex min-h-24 items-center justify-center rounded-lg border border-destructive/20 bg-destructive/5 text-sm text-destructive">
							Unable to load transactions.
						</div>
					) : transactions.length === 0 ? (
						<div className="flex min-h-24 items-center justify-center rounded-lg border border-(--line) bg-(--surface-strong) text-sm text-muted-foreground">
							No transactions in this group.
						</div>
					) : (
						<div className="space-y-2">
							<TransactionCard
								transactions={transactions.map(mapTransaction)}
							/>
							{hasNextPage || isFetchingNextPage ? (
								<div
									ref={loadMoreGroupTransactionsRef}
									className="flex min-h-10 items-center justify-center text-xs text-muted-foreground"
								>
									{isFetchingNextPage ? "Loading more transactions..." : ""}
								</div>
							) : null}
						</div>
					)}
				</div>
			) : null}
		</div>
	);
};

interface TransactionHistoryProps {
	baseCriteria: NonNullable<GetTransactionRequest["criteria"]>;
	groupBy: TransactionGroupBy | null;
	groupDirection: TransactionGroupDirection;
	sortBy: TransactionSortBy;
	sortDirection: SortDirection;
}

export const TransactionHistory = ({
	baseCriteria,
	groupBy,
	groupDirection,
	sortBy,
	sortDirection,
}: TransactionHistoryProps) => {
	const [expandedGroupKey, setExpandedGroupKey] = useState<string | null>(null);
	const {
		error,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		transactions,
	} = useInfiniteUserTransactions(
		{
			criteria: baseCriteria,
			order_by: {
				field: transactionSortFieldByValue[sortBy],
				direction: sortDirection,
			},
			pagination: { limit: TRANSACTION_PAGE_LIMIT },
		},
		groupBy === null,
	);
	const {
		error: groupByError,
		fetchNextPage: fetchNextGroupPage,
		groups: groupSummaries,
		hasNextPage: hasNextGroupPage,
		isFetchingNextPage: isFetchingNextGroupPage,
		isLoading: isGroupByLoading,
	} = useTransactionGroupBy(
		{
			criteria: baseCriteria,
			direction: groupDirection,
			group_by: transactionGroupFieldByValue[groupBy ?? "date"],
			pagination: { limit: GROUP_BY_PAGE_LIMIT },
		},
		groupBy !== null,
	);
	const loadMoreRef = useInfiniteScrollSentinel({
		listMode: "infiniteScroll",
		isFetchingNextPage,
		onLoadMore: () => {
			void fetchNextPage();
		},
		hasNextPage,
		enabled: groupBy === null,
		rootMargin: "240px",
	});
	const loadMoreGroupsRef = useInfiniteScrollSentinel({
		listMode: "infiniteScroll",
		isFetchingNextPage: isFetchingNextGroupPage,
		onLoadMore: () => {
			void fetchNextGroupPage();
		},
		hasNextPage: hasNextGroupPage,
		enabled: groupBy !== null,
		rootMargin: "240px",
	});

	const groups = useMemo(() => {
		const rows = transactions.map(mapTransaction);

		return rows.reduce<Record<string, Transaction[]>>((acc, transaction) => {
			const label = getDateGroupLabel(transaction.date);
			acc[label] = [...(acc[label] ?? []), transaction];
			return acc;
		}, {});
	}, [transactions]);

	const sortedGroups = useMemo(() => Object.entries(groups), [groups]);

	return (
		<section className="relative z-0 rounded-xl border border-(--line) bg-(--surface) p-4 shadow-sm backdrop-blur">
			<div className="mb-4 flex items-center justify-between gap-3">
				<div className="flex items-center gap-2">
					<ListFilter size={17} className="text-primary" />
					<h1 className="text-base font-semibold text-foreground">
						Transaction history
					</h1>
				</div>
			</div>

			{groupBy !== null ? (
				isGroupByLoading ? (
					<TransactionListSkeleton items={6} />
				) : groupByError ? (
					<div className="flex min-h-32 items-center justify-center rounded-lg border border-destructive/20 bg-destructive/5 text-sm text-destructive">
						Unable to load grouped transactions.
					</div>
				) : groupSummaries.length === 0 ? (
					<div className="flex min-h-32 items-center justify-center rounded-lg border border-(--line) bg-(--surface-strong) text-sm text-muted-foreground">
						No transaction groups match these filters.
					</div>
				) : (
					<div className="space-y-2">
						{groupSummaries.map((group) => {
							const groupKey = `${groupBy}:${group.group_by_value}`;
							return (
								<TransactionGroupPanel
									key={groupKey}
									baseCriteria={baseCriteria}
									direction={sortDirection}
									group={group}
									groupBy={groupBy}
									isOpen={expandedGroupKey === groupKey}
									onToggle={() =>
										setExpandedGroupKey((current) =>
											current === groupKey ? null : groupKey,
										)
									}
									sortBy={sortBy}
								/>
							);
						})}
						{hasNextGroupPage || isFetchingNextGroupPage ? (
							<div
								ref={loadMoreGroupsRef}
								className="flex min-h-10 items-center justify-center text-xs text-muted-foreground"
							>
								{isFetchingNextGroupPage ? "Loading more groups..." : ""}
							</div>
						) : null}
					</div>
				)
			) : isLoading ? (
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
							</div>
							<TransactionCard transactions={rows} />
						</div>
					))}
					{hasNextPage || isFetchingNextPage ? (
						<div
							ref={loadMoreRef}
							className="flex min-h-10 items-center justify-center text-xs text-muted-foreground"
						>
							{isFetchingNextPage ? "Loading more transactions..." : ""}
						</div>
					) : null}
				</div>
			)}
		</section>
	);
};
