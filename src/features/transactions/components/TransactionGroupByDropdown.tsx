import { ArrowDown, ArrowUp, ChevronDown } from "lucide-react";
import { DropDown } from "@/shared/components/DropDown";

export type TransactionGroupBy = "date" | "type" | "category";
export type TransactionGroupDirection = "asc" | "desc";

interface TransactionGroupByDropdownProps {
	value: TransactionGroupBy | null;
	direction: TransactionGroupDirection;
	onChange: (value: TransactionGroupBy | null) => void;
	onDirectionChange: (value: TransactionGroupDirection) => void;
	className?: string;
}

const groupByOptions: { title: string; value: TransactionGroupBy }[] = [
	{ title: "Date", value: "date" },
	{ title: "Transaction type", value: "type" },
	{ title: "Transaction category", value: "category" },
];

const directionOptions: { title: string; value: TransactionGroupDirection }[] =
	[
		{ title: "Ascending", value: "asc" },
		{ title: "Descending", value: "desc" },
	];

const TransactionGroupByDropdown = ({
	value,
	direction,
	onChange,
	onDirectionChange,
	className,
}: TransactionGroupByDropdownProps) => {
	const selectedGroupTitle =
		groupByOptions.find((option) => option.value === value)?.title ?? "None";
	const DirectionIcon = direction === "asc" ? ArrowUp : ArrowDown;

	return (
		<DropDown
			triggerClassName={`h-11 min-h-11 bg-popover px-3 py-1 text-sm text-foreground focus:outline-primary border border-(--line) rounded-lg hover:border-primary/40 hover:bg-primary/5 transition w-full ${className ?? ""}`}
			triggerLabel="Group by"
			placeholder="Select group"
			selectedValues={[...(value ? [value] : []), direction]}
			sections={[
				{
					sectionType: "radio",
					sectionName: "Group by",
					items: groupByOptions,
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

				if (section.sectionName === "Group by") {
					const nextValue = item.value as TransactionGroupBy;
					onChange(nextValue === value ? null : nextValue);
					return;
				}

				if (section.sectionName === "Direction") {
					onDirectionChange(item.value as TransactionGroupDirection);
				}
			}}
		>
			<span className="flex min-w-0 flex-1 flex-col items-start gap-0.5">
				<span className="text-[10px] font-bold uppercase leading-none text-foreground">
					Group by
				</span>
				<div className="flex min-w-0 items-center gap-2 leading-tight">
					<span className="truncate text-xs text-foreground">
						{selectedGroupTitle}
					</span>
					{value ? (
						<DirectionIcon size={14} className="shrink-0 text-primary" />
					) : null}
				</div>
			</span>
			<ChevronDown
				size={17}
				className="shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180"
			/>
		</DropDown>
	);
};

export default TransactionGroupByDropdown;
