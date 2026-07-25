import { DropDown } from "@/shared/components/DropDown";
import { ArrowDown, ArrowUp, ChevronDown } from "lucide-react";

export type CategorySortBy = "amount" | "name" | null;
export type CategorySortDirection = "asc" | "desc";

const sortOptions = [
  { title: "Amount", value: "amount" },
  { title: "Name", value: "name" },
] as const;

const directionOptions = [
  { title: "Ascending", value: "asc" },
  { title: "Descending", value: "desc" },
] as const;

export interface CategorySortByDropdownProps {
  sortBy: CategorySortBy | null;
  setSortBy: (sortBy: CategorySortBy | null) => void;
  direction: CategorySortDirection;
  setDirection: (direction: CategorySortDirection) => void;
  selectedSortTitle: string;
}

export const CategorySortByDropdown = ({
  sortBy,
  setSortBy,
  direction,
  setDirection,
  selectedSortTitle,
}: CategorySortByDropdownProps) => {
  const DirectionIcon = direction === "asc" ? ArrowUp : ArrowDown;

  return (
    <DropDown
      triggerAriaLabel="Sort categories"
      triggerClassName="h-11 min-h-11 w-full bg-popover px-3 py-1 text-sm text-foreground hover:border-primary/40 hover:bg-primary/5 sm:w-52"
      contentClassName="w-48"
      selectedValues={sortBy ? [sortBy, direction] : []}
      sections={[
        {
          sectionName: "Sort by",
          sectionType: "static",
          items: [...sortOptions],
        },
        {
          sectionName: "Direction",
          sectionType: "radio",
          items: directionOptions.map((option) => ({
            ...option,
            disabled: !sortBy,
          })),
        },
      ]}
      onItemSelect={({ section, item, isSelected }) => {
        if (section.sectionName === "Sort by") {
          setSortBy(
            isSelected ? null : (item.value as Exclude<CategorySortBy, null>),
          );
          return;
        }

        if (sortBy) {
          setDirection(item.value as CategorySortDirection);
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
          {sortBy && <DirectionIcon size={14} className="shrink-0 text-primary" />}
        </div>
      </span>
      <ChevronDown
        size={17}
        className="shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180 cursor-pointer"
      />
    </DropDown>
  );
};
