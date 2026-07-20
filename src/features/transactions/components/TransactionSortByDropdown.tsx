import { ArrowDown, ArrowUp, ChevronDown } from "lucide-react";
import { DropDown } from "@/shared/components/DropDown";

export type TransactionSortBy = "description" | "amount" | "date";
export type TransactionSortDirection = "asc" | "desc";

interface TransactionSortByDropdownProps {
	value: TransactionSortBy;
	direction: TransactionSortDirection;
	onChange: (value: TransactionSortBy) => void;
	onDirectionChange: (value: TransactionSortDirection) => void;
	className?: string;
}

const sortByOptions: { title: string; value: TransactionSortBy }[] = [
	{ title: "Date", value: "date" },
	{ title: "Description", value: "description" },
	{ title: "Amount", value: "amount" },
];

const directionOptions: { title: string; value: TransactionSortDirection }[] = [
	{ title: "Ascending", value: "asc" },
	{ title: "Descending", value: "desc" },
];

const TransactionSortByDropdown = ({
	value,
	direction,
	onChange,
	onDirectionChange,
	className,
}: TransactionSortByDropdownProps) => {
	const selectedSortTitle =
		sortByOptions.find((option) => option.value === value)?.title ?? "Date";
	const DirectionIcon = direction === "asc" ? ArrowUp : ArrowDown;

	return (
		<DropDown
			triggerClassName={`h-11 min-h-11 bg-popover px-3 py-1 text-sm text-foreground focus:outline-primary border border-(--line) rounded-lg hover:border-primary/40 hover:bg-primary/5 transition w-full ${className ?? ""}`}
			triggerLabel="Sort by"
			placeholder="Select sort"
			selectedValues={[value, direction]}
			sections={[
				{
					sectionType: "radio",
					sectionName: "Sort by",
					className: "max-h-[150px] overflow-y-auto pr-1",
					items: sortByOptions,
				},
				{
					sectionType: "radio",
					sectionName: "Direction",
					items: directionOptions,
				},
			]}
			onItemSelect={({ section, item }) => {
				if (section.sectionType !== "radio") {
					return;
				}

				if (section.sectionName === "Sort by") {
					onChange(item.value as TransactionSortBy);
					return;
				}

				if (section.sectionName === "Direction") {
					onDirectionChange(item.value as TransactionSortDirection);
				}
			}}
		>
			<span className="flex min-w-0 flex-1 flex-col items-start gap-0.5">
				<span className="text-[10px] font-bold uppercase leading-none text-foreground">
					Sort by
				</span>
				<div className="flex min-w-0 items-center gap-2 leading-tight">
					<span className="truncate text-xs text-foreground">
						{selectedSortTitle}
					</span>
					<DirectionIcon size={14} className="shrink-0 text-primary" />
				</div>
			</span>
			<ChevronDown
				size={17}
				className="shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180"
			/>
		</DropDown>
	);
};

export default TransactionSortByDropdown;
