import { SegmentedControl } from "@radix-ui/themes";
import { cn } from "@/shared/utils/Utils";

export type CustomSegmentedControlOption<TValue extends string> = {
	label: string;
	value: TValue;
};

interface CustomSegmentedControlProps<TValue extends string> {
	value: TValue;
	options: CustomSegmentedControlOption<TValue>[];
	onValueChange: (value: TValue) => void;
	className?: string;
	itemClassName?: string;
	ariaLabel?: string;
}

const segmentedControlRootClassName = [
	"!rounded-lg",
	"border",
	"border-(--line)",
	"!h-10",
	"!bg-popover",
	"!bg-none",
	"![background-image:none]",
	"hover:!bg-popover",
	"hover:!bg-none",
	"hover:![background-image:none]",
	"hover:!border-primary/40",
	"[&_.rt-SegmentedControlItemLabel]:!bg-transparent",
	"[&_.rt-SegmentedControlItemLabel]:!px-2",
	"[&_.rt-SegmentedControlItemLabel:hover]:!bg-transparent",
	"[&_.rt-SegmentedControlItem[data-state=off]:hover_.rt-SegmentedControlItemLabel]:!bg-transparent",
	"[&_.rt-SegmentedControlIndicator::before]:!rounded-lg",
	"[&_.rt-SegmentedControlIndicator::before]:!inset-0",
	"[&_.rt-SegmentedControlIndicator::before]:!bg-primary",
	"[&_.rt-SegmentedControlItem[data-state=on]:hover~.rt-SegmentedControlIndicator::before]:!bg-primary/80",
].join(" ");

const segmentedControlItemClassName = [
	"!cursor-pointer",
	"data-[state=on]:!text-primary-foreground",
].join(" ");

export function CustomSegmentedControl<TValue extends string>({
	value,
	options,
	onValueChange,
	className,
	itemClassName,
	ariaLabel,
}: CustomSegmentedControlProps<TValue>) {
	const optionValues = new Set(options.map((option) => option.value));

	return (
		<SegmentedControl.Root
			aria-label={ariaLabel}
			className={cn(segmentedControlRootClassName, className)}
			value={value}
			onValueChange={(nextValue) => {
				if (optionValues.has(nextValue as TValue)) {
					onValueChange(nextValue as TValue);
				}
			}}
		>
			{options.map((option) => (
				<SegmentedControl.Item
					key={option.value}
					className={cn(segmentedControlItemClassName, itemClassName)}
					value={option.value}
				>
					{option.label}
				</SegmentedControl.Item>
			))}
		</SegmentedControl.Root>
	);
}

export default CustomSegmentedControl;
