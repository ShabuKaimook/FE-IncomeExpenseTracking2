import { DropdownMenu } from "radix-ui";
import { useState } from "react";
import type { ReactNode } from "react";
import {
	ChevronDown,
	Circle,
	CircleDot,
	Square,
	SquareCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/shared/utils/Utils";

export type DropDownSectionType = "radio" | "static" | "checkbox";

export type DropDownItem = {
	icon?: LucideIcon;
	title: string;
	value: string;
	disabled?: boolean;
};

export type DropDownSection = {
	sectionName?: string;
	sectionType: DropDownSectionType;
	className?: string;
	items: DropDownItem[];
};

export type DropDownSelectEvent = {
	section: DropDownSection;
	item: DropDownItem;
	isSelected: boolean;
	nextSelectedValues: string[];
};

export interface DropDownProps {
	children?: ReactNode;
	sections: DropDownSection[];
	selectedValues?: string[];
	triggerLabel?: string;
	placeholder?: string;
	onItemSelect?: (event: DropDownSelectEvent) => void;
	triggerClassName?: string;
	contentClassName?: string;
	sectionClassName?: string;
	itemClassName?: string;
	triggerAriaLabel?: string;
	align?: "start" | "center" | "end";
	side?: "top" | "right" | "bottom" | "left";
	disabled?: boolean;
	closeCheckboxOnSelect?: boolean;
}

const defaultTriggerClassName =
	"group inline-flex min-h-11 min-w-0 items-center justify-between gap-3 rounded-lg border border-(--line) bg-(--surface) px-3 text-left text-sm outline-none transition hover:bg-(--surface-strong) focus-visible:ring-2 focus-visible:ring-primary/40 disabled:pointer-events-none disabled:opacity-50";

const defaultContentClassName =
	"z-50 min-w-48 origin-[var(--radix-dropdown-menu-content-transform-origin)] overflow-hidden rounded-lg border border-(--line) bg-popover p-1.5 text-popover-foreground shadow-xl transition duration-150 ease-out data-[side=bottom]:slide-in-from-top-1 data-[side=top]:slide-in-from-bottom-1 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:scale-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:scale-in-95";

const defaultItemClassName =
	"relative flex w-full cursor-pointer select-none items-center gap-2 rounded-md px-2.5 py-2 text-sm outline-none transition hover:bg-primary/10 focus:bg-primary/10 data-[selected=true]:bg-primary/20 data-[state=checked]:bg-primary/20 data-[disabled]:pointer-events-none data-[disabled]:opacity-45";

const controlClassName = "size-4 shrink-0 text-primary";

const getNextSelectedValues = (
	section: DropDownSection,
	item: DropDownItem,
	selectedValues: string[],
) => {
	if (section.sectionType === "static") {
		return selectedValues;
	}

	if (section.sectionType === "checkbox") {
		return selectedValues.includes(item.value)
			? selectedValues.filter((value) => value !== item.value)
			: [...selectedValues, item.value];
	}

	const sectionValueSet = new Set(section.items.map((sectionItem) => sectionItem.value));
	return [
		...selectedValues.filter((value) => !sectionValueSet.has(value)),
		item.value,
	];
};

const renderSelectionControl = (
	sectionType: DropDownSectionType,
	isSelected: boolean,
) => {
	if (sectionType === "radio") {
		const RadioIcon = isSelected ? CircleDot : Circle;
		return <RadioIcon className={controlClassName} strokeWidth={2.2} />;
	}

	if (sectionType === "checkbox") {
		const CheckboxIcon = isSelected ? SquareCheck : Square;
		return <CheckboxIcon className={controlClassName} strokeWidth={2.2} />;
	}

	return null;
};

const renderItemContent = (
	sectionType: DropDownSectionType,
	item: DropDownItem,
	isSelected: boolean,
) => {
	const Icon = item.icon;

	return (
		<>
			{renderSelectionControl(sectionType, isSelected)}
			{Icon && <Icon size={16} className="shrink-0 text-muted-foreground" />}
			<span className="min-w-0 flex-1 truncate text-left">{item.title}</span>
		</>
	);
};

const getSelectedItemTitles = (
	sections: DropDownSection[],
	selectedValueSet: Set<string>,
) =>
	sections
		.flatMap((section) => section.items)
		.filter((item) => selectedValueSet.has(item.value))
		.map((item) => item.title);

const renderTriggerContent = ({
	children,
	label,
	placeholder,
	selectedTitles,
}: {
	children?: ReactNode;
	label: string;
	placeholder: string;
	selectedTitles: string[];
}) => {
	if (children !== undefined && typeof children !== "string") {
		return children;
	}

	const triggerLabel = typeof children === "string" ? children : label;
	const hasSelectedItems = selectedTitles.length > 0;

	return (
		<>
			<span className="min-w-0 flex-1">
				<span
					className={cn(
						"block text-[11px] uppercase text-muted-foreground",
						hasSelectedItems && "font-bold text-foreground",
					)}
				>
					{triggerLabel}
				</span>
				<span
					className={cn(
						"block truncate font-medium",
						hasSelectedItems ? "text-foreground" : "text-muted-foreground",
					)}
				>
					{hasSelectedItems ? selectedTitles.join(", ") : placeholder}
				</span>
			</span>
			<ChevronDown size={17} className="shrink-0 text-muted-foreground" />
		</>
	);
};

export function DropDown({
	children,
	sections,
	selectedValues,
	triggerLabel = "Select",
	placeholder = "Select",
	onItemSelect,
	triggerClassName,
	contentClassName,
	sectionClassName,
	itemClassName,
	triggerAriaLabel,
	align = "end",
	side = "bottom",
	disabled = false,
	closeCheckboxOnSelect = false,
}: DropDownProps) {
	const [uncontrolledSelectedValues, setUncontrolledSelectedValues] = useState<
		string[]
	>([]);
	const isControlled = selectedValues !== undefined;
	const currentSelectedValues = selectedValues ?? uncontrolledSelectedValues;
	const selectedValueSet = new Set(currentSelectedValues);
	const selectedTitles = getSelectedItemTitles(sections, selectedValueSet);

	const handleItemSelect = (section: DropDownSection, item: DropDownItem) => {
		const nextSelectedValues = getNextSelectedValues(
			section,
			item,
			currentSelectedValues,
		);

		if (!isControlled) {
			setUncontrolledSelectedValues(nextSelectedValues);
		}

		onItemSelect?.({
			section,
			item,
			isSelected: selectedValueSet.has(item.value),
			nextSelectedValues,
		});
	};

	return (
		<DropdownMenu.Root>
			<DropdownMenu.Trigger asChild disabled={disabled}>
				<button
					type="button"
					aria-label={triggerAriaLabel}
					className={cn(defaultTriggerClassName, triggerClassName)}
				>
					{renderTriggerContent({
						children,
						label: triggerLabel,
						placeholder,
						selectedTitles,
					})}
				</button>
			</DropdownMenu.Trigger>

			<DropdownMenu.Portal>
				<DropdownMenu.Content
					align={align}
					side={side}
					sideOffset={8}
					className={cn(defaultContentClassName, contentClassName)}
				>
					{sections.map((section, sectionIndex) => {
						const radioValue =
							section.sectionType === "radio"
								? section.items.find((item) => selectedValueSet.has(item.value))
										?.value
								: undefined;

						return (
							<div
								key={section.sectionName ?? `section-${sectionIndex}`}
								className={cn(
									sectionIndex > 0 && "mt-1 border-t border-(--line) pt-1",
									section.className,
									sectionClassName,
								)}
							>
								{section.sectionName && (
									<div className="px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
										{section.sectionName}
									</div>
								)}

								{section.sectionType === "radio" ? (
									<DropdownMenu.RadioGroup value={radioValue}>
										{section.items.map((item, itemIndex) => {
											const isSelected = selectedValueSet.has(item.value);

											return (
												<DropdownMenu.RadioItem
													key={`${item.value}-${item.title}-${itemIndex}`}
													value={item.value}
													data-selected={isSelected}
													disabled={item.disabled}
													onSelect={() => handleItemSelect(section, item)}
													className={cn(defaultItemClassName, itemClassName)}
												>
													{renderItemContent(
														section.sectionType,
														item,
														isSelected,
													)}
												</DropdownMenu.RadioItem>
											);
										})}
									</DropdownMenu.RadioGroup>
								) : (
									section.items.map((item, itemIndex) => {
										const isSelected = selectedValueSet.has(item.value);

										if (section.sectionType === "checkbox") {
											return (
												<DropdownMenu.CheckboxItem
													key={`${item.value}-${item.title}-${itemIndex}`}
													checked={isSelected}
													data-selected={isSelected}
													disabled={item.disabled}
													onSelect={(event) => {
														if (!closeCheckboxOnSelect) {
															event.preventDefault();
														}
														handleItemSelect(section, item);
													}}
													className={cn(defaultItemClassName, itemClassName)}
												>
													{renderItemContent(
														section.sectionType,
														item,
														isSelected,
													)}
												</DropdownMenu.CheckboxItem>
											);
										}

										return (
											<DropdownMenu.Item
												key={`${item.value}-${item.title}-${itemIndex}`}
												data-selected={isSelected}
												disabled={item.disabled}
												onSelect={() => handleItemSelect(section, item)}
												className={cn(defaultItemClassName, itemClassName)}
											>
												{renderItemContent(
													section.sectionType,
													item,
													isSelected,
												)}
											</DropdownMenu.Item>
										);
									})
								)}
							</div>
						);
					})}
				</DropdownMenu.Content>
			</DropdownMenu.Portal>
		</DropdownMenu.Root>
	);
}
