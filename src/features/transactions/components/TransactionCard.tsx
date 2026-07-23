import { useNavigate } from "@tanstack/react-router";
import { Ellipsis, Pencil, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { DropDown } from "@/shared/components/DropDown";
import { TRANSACTION_TYPE } from "@/shared/constants/TransactionTypeEnum";
import { formatMoney } from "@/shared/utils/FormatMoney";
import { useDeleteTransaction } from "../hooks/useDeleteTransaction";

type TransactionTypeId =
	(typeof TRANSACTION_TYPE)[keyof typeof TRANSACTION_TYPE]["id"];
type TransactionTypeName =
	(typeof TRANSACTION_TYPE)[keyof typeof TRANSACTION_TYPE]["name"];

export interface Transaction {
	id: string;
	date: string;
	description: string;
	amount: number;
	currency: string;
	category: string;
	userTransactionCategoryId: string;
	type_id: TransactionTypeId;
	type_name: TransactionTypeName | string;
}

interface TransactionCardProps {
	transactions: Transaction[];
	onEditTransaction?: (transaction: Transaction) => void;
}

const formatAmount = (transaction: Transaction) => {
	return `${transaction.type_id === TRANSACTION_TYPE.INCOME.id ? "+" : "-"}${formatMoney(
		transaction.amount,
		transaction.currency,
	)}`;
};

export const TransactionCard = ({
	transactions,
	onEditTransaction,
}: TransactionCardProps) => {
	const navigate = useNavigate();
	const deleteTransaction = useDeleteTransaction();

	const handleEditTransaction = (transaction: Transaction) => {
		if (onEditTransaction) {
			onEditTransaction(transaction);
			return;
		}

		sessionStorage.setItem(
			`transaction-edit:${transaction.id}`,
			JSON.stringify(transaction),
		);
		navigate({
			to: "/transaction/create",
			search: {
				edit_transaction_id: transaction.id,
			},
		});
	};

	const handleDeleteTransaction = (transaction: Transaction) => {
		deleteTransaction.mutate(transaction.id, {
			onSuccess: () => {
				toast.success("Transaction deleted.");
			},
			onError: () => {
				toast.error("Unable to delete transaction.");
			},
		});
	};

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
								<DropDown
									triggerAriaLabel="Open transaction actions"
									triggerClassName="absolute right-2 top-2 z-10 min-h-8 size-8 justify-center rounded-full border-none !bg-transparent p-0 hover:!bg-primary/10 focus:!border-none focus:!ring-0 focus:!ring-offset-0 group-hover:flex cursor-pointer"
									contentClassName="w-44"
									isShowTriggerLabel={false}
									sections={[
										{
											sectionType: "static",
											items: [
												{
													icon: Pencil,
													title: "Edit",
													value: "edit",
												},
												{
													icon: Trash2,
													title: "Delete",
													value: "delete",
													disabled: deleteTransaction.isPending,
												},
											],
										},
									]}
									onItemSelect={({ item }) => {
										if (item.value === "edit") {
											handleEditTransaction(transaction);
										}

										if (item.value === "delete") {
											handleDeleteTransaction(transaction);
										}
									}}
								>
									<Ellipsis size={17} className="text-muted-foreground" />
								</DropDown>
								<span
									className={`absolute inset-y-0 left-0 w-1 ${
										isIncome ? "bg-primary" : "bg-destructive"
									}`}
									aria-hidden="true"
								/>

								<div className="flex min-w-0 items-center gap-3">
									<div className="min-w-0">
										<div className="flex min-w-0 items-center gap-2">
											<span
												className={`h-2 w-2 rounded-full ${
													isIncome ? "bg-primary" : "bg-destructive"
												}`}
											/>
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
											<span className="text-neutral-400 text-xs">
												{transaction.date}
											</span>
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
