import { ChevronDown, RotateCcw, SlidersHorizontal } from "lucide-react";
import { useMemo } from "react";
import { useUserTransactionCategories } from "@/features/userTransactionCategories/hooks/useUserTransactionCategories";
import { DropDown } from "@/shared/components/DropDown";
import { TRANSACTION_TYPE } from "@/shared/constants/TransactionTypeEnum";

export type TransactionFilterValue = {
	transactionTypeId?: number;
	userTransactionCategoryIds?: string[];
	amountRangeStart?: string;
	amountRangeEnd?: string;
};

interface TransactionFilterDropdownProps {
	value: TransactionFilterValue;
	onChange: (value: TransactionFilterValue) => void;
	className?: string;
}

const typeSectionName = "Transaction type";
const categorySectionName = "Transaction category";

const transactionTypeOptions = [
	{ title: "Income", value: String(TRANSACTION_TYPE.INCOME.id) },
	{ title: "Expense", value: String(TRANSACTION_TYPE.EXPENSE.id) },
];

const countActiveFilters = (value: TransactionFilterValue) =>
	[
		value.transactionTypeId,
		value.userTransactionCategoryIds?.length,
		value.amountRangeStart && value.amountRangeEnd,
	].filter(Boolean).length;

const TransactionFilterDropdown = ({
	value,
	onChange,
	className,
}: TransactionFilterDropdownProps) => {
	const { categories, isLoading } = useUserTransactionCategories();
	const activeFilterCount = countActiveFilters(value);

	const categoryOptions = useMemo(
		() =>
			categories.map((category) => ({
				title: category.user_transaction_category_name,
				value: category.user_transaction_category_id,
			})),
		[categories],
	);

	const selectedValues = [
		...(value.transactionTypeId ? [String(value.transactionTypeId)] : []),
		...(value.userTransactionCategoryIds ?? []),
	];

	return (
		<DropDown
			triggerAriaLabel="Open transaction filters"
			triggerClassName={`h-full min-h-0 border-l border-y-0 border-r-0 border-(--line) bg-transparent px-2.5 hover:bg-transparent focus-visible:ring-0 ${className ?? ""}`}
			contentClassName="w-72"
			selectedValues={selectedValues}
			sections={[
				{
					sectionType: "radio",
					sectionName: typeSectionName,
					items: transactionTypeOptions,
				},
				{
					sectionType: "checkbox",
					sectionName: categorySectionName,
					className: "max-h-[155px] overflow-y-auto pr-1",
					items: isLoading
						? [
								{
									title: "Loading categories",
									value: "category-loading",
									disabled: true,
								},
							]
						: categoryOptions,
				},
				{
					sectionType: "static",
					sectionName: "Amount",
					items: [],
					content: (
						<div className="grid grid-cols-2 gap-2 px-2.5 pb-2 pt-1">
							<label className="flex min-w-0 flex-col gap-1 text-xs font-medium text-muted-foreground">
								Start
								<input
									type="number"
									inputMode="decimal"
									min="0"
									value={value.amountRangeStart ?? ""}
									onChange={(event) =>
										onChange({
											...value,
											amountRangeStart: event.target.value,
										})
									}
									placeholder="0"
									className="h-9 min-w-0 rounded-md border border-(--line) bg-(--surface) px-2 text-sm font-semibold text-foreground outline-none transition placeholder:text-muted-foreground/60 focus:border-primary/50 focus:ring-2 focus:ring-primary/15"
								/>
							</label>
							<label className="flex min-w-0 flex-col gap-1 text-xs font-medium text-muted-foreground">
								End
								<input
									type="number"
									inputMode="decimal"
									min="0"
									value={value.amountRangeEnd ?? ""}
									onChange={(event) =>
										onChange({
											...value,
											amountRangeEnd: event.target.value,
										})
									}
									placeholder="5000"
									className="h-9 min-w-0 rounded-md border border-(--line) bg-(--surface) px-2 text-sm font-semibold text-foreground outline-none transition placeholder:text-muted-foreground/60 focus:border-primary/50 focus:ring-2 focus:ring-primary/15"
								/>
							</label>
						</div>
					),
				},
				{
					sectionType: "static",
					items: [],
					content: (
						<button
							type="button"
							disabled={activeFilterCount === 0}
							onClick={() => onChange({})}
							className="flex h-9 w-full items-center justify-center gap-2 rounded-md text-sm font-semibold text-primary transition hover:bg-primary/10 disabled:pointer-events-none disabled:text-muted-foreground/50"
						>
							<RotateCcw size={15} />
							Reset filters
						</button>
					),
				},
			]}
			onItemSelect={({ section, item, isSelected }) => {
				if (section.sectionName === typeSectionName) {
					onChange({
						...value,
						transactionTypeId: isSelected ? undefined : Number(item.value),
					});
					return;
				}

				if (section.sectionName === categorySectionName && !item.disabled) {
					onChange({
						...value,
						userTransactionCategoryIds: isSelected
							? value.userTransactionCategoryIds?.filter(
									(categoryId) => categoryId !== item.value,
								)
							: [...(value.userTransactionCategoryIds ?? []), item.value],
					});
				}
			}}
		>
			<span className="inline-flex h-full items-center gap-2 text-primary">
				<SlidersHorizontal size={17} className="shrink-0" />
				{activeFilterCount > 0 ? (
					<span className="grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1.5 text-[11px] font-bold leading-none text-primary-foreground">
						{activeFilterCount}
					</span>
				) : null}
			</span>
			<ChevronDown
				size={15}
				className="shrink-0 text-primary transition-transform duration-200 group-data-[state=open]:rotate-180"
			/>
		</DropDown>
	);
};

export default TransactionFilterDropdown;
