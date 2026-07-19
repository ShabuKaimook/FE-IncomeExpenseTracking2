import { DropDown } from "@/shared/components/DropDown";
import { ArrowDown, ArrowUp, ChevronDown } from "lucide-react";

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
      triggerClassName={`min-h-11 bg-popover px-3 text-sm text-foreground focus:outline-primary border-2 border-(--line) rounded-lg hover:border-primary/40 transition w-full ${className ?? ""}`}
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
      <span className="flex min-w-0 flex-1 items-center gap-2 text-sm">
        <span className="shrink-0 font-medium text-foreground">Sort by:</span>
        <DirectionIcon size={15} className="shrink-0 text-primary" />
        <span className="truncate font-medium text-foreground">
          {selectedSortTitle}
        </span>
      </span>
      <ChevronDown size={17} className="shrink-0 text-muted-foreground" />
    </DropDown>
  );
};

export default TransactionSortByDropdown;
