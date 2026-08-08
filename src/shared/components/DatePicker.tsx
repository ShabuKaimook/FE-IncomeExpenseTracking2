import {
	DayPicker,
	type DateRange as DayPickerDateRange,
	SelectionState,
	UI,
} from "@daypicker/react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { type CSSProperties, useEffect, useState } from "react";
import "@daypicker/react/style.css";
import { DropdownMenu } from "@radix-ui/themes";
import CustomSegmentedControl from "@/shared/components/CustomSegmentedControl";
import {
	formatShortDate,
	formatShortDateRange,
	getAllMonthShortNames,
	getMonthDateRange,
	getWeekDateRange,
} from "@/shared/utils/date";

export type DatePickerMode = "month" | "week" | "custom" | "single";

export type DatePickerRange = {
	mode: DatePickerMode;
	startDate: Date | null;
	endDate: Date | null;
};

export interface DatePickerProps {
	mode?: DatePickerMode;
	value: Date | null;
	onChange: (date: Date | null) => void;
	onRangeChange?: (range: DatePickerRange) => void;
	modeOptions?: readonly {
		label: string;
		value: DatePickerMode;
	}[];
	className?: string;
	hideTriggerLabel?: boolean;
	triggerIcon?: React.ReactNode;
}

// STYLES
const headerButtonClassName =
	"inline-flex size-7 items-center justify-center rounded-lg text-primary-foreground transition hover:bg-primary-foreground/15 disabled:cursor-not-allowed disabled:opacity-40";

const calendarSurfaceClassName =
	"overflow-hidden rounded-lg border border-(--line) bg-popover shadow-sm";

const dayPickerClassNames = {
	[UI.Weekday]: "h-5 text-xs font-medium text-muted-foreground",
	[UI.Day]: "size-7 p-0",
	[UI.MonthCaption]:
		"flex h-10 items-center justify-center bg-primary text-sm font-bold text-primary-foreground rounded-t-lg mb-1",
	[UI.DayButton]:
		"flex size-8 items-center justify-center rounded-lg text-xs text-(--sea-ink-soft) transition hover:bg-primary/30 hover:text-(--sea-ink) focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary",
	[SelectionState.selected]: "[&>button]:rounded-lg [&>button]:bg-primary",
	[SelectionState.range_start]:
		"rounded-lg bg-primary/10 [&>button]:rounded-l-lg [&>button]:rounded-r-none [&>button]:bg-primary [&>button]:text-primary-foreground",
	[SelectionState.range_middle]:
		"[&>button]:rounded-none [&>button]:bg-primary/10 [&>button]:text-muted-foreground/80",
	[SelectionState.range_end]:
		"rounded-r-lg bg-primary/10 [&>button]:rounded-l-none [&>button]:rounded-r-lg [&>button]:!bg-primary [&>button]:text-primary-foreground",
	[UI.Chevron]:
		"fill-popover text-(--sea-ink-soft) transition hover:text-(--sea-ink) size-4 [&>svg]:size-3 [&>svg]:stroke-(--sea-ink-soft) [&>svg]:transition [&>svg]:hover:stroke-(--sea-ink)",
};

const dayPickerStyles = {
	root: {
		"--rdp-accent-color": "var(--primary)",
		"--rdp-accent-background-color":
			"color-mix(in oklab, var(--primary) 12%, transparent)",
	} as CSSProperties,
};

const weekRangeModifierClassNames = {
	week_range_start:
		"rounded-lg bg-primary/10 [&>button]:rounded-l-lg [&>button]:rounded-r-none [&>button]:bg-primary [&>button]:text-primary-foreground",
	week_range_middle:
		"[&>button]:rounded-none [&>button]:bg-primary/10 [&>button]:text-muted-foreground/80",
	week_range_end:
		"rounded-r-lg bg-primary/10 [&>button]:rounded-l-none [&>button]:rounded-r-lg [&>button]:!bg-primary [&>button]:text-primary-foreground",
};

const datePickerModeOptions: {
	label: string;
	value: DatePickerMode;
}[] = [
	{ label: "Month", value: "month" },
	{ label: "Range", value: "custom" },
	{ label: "Single", value: "single" },
];

const getInitialDateRange = (mode: DatePickerMode, value: Date | null) => {
	if (!value) {
		return {
			startDate: null,
			endDate: null,
		};
	}

	if (mode === "month") {
		return getMonthDateRange(value);
	}

	if (mode === "custom") {
		return getWeekDateRange(value);
	}

	if (mode === "week") {
		return getWeekDateRange(value);
	}

	return {
		startDate: value,
		endDate: value,
	};
};

const isSameDate = (leftDate: Date, rightDate: Date) =>
	leftDate.getFullYear() === rightDate.getFullYear() &&
	leftDate.getMonth() === rightDate.getMonth() &&
	leftDate.getDate() === rightDate.getDate();

const isBetweenDates = (date: Date, startDate: Date, endDate: Date) =>
	date.getTime() > startDate.getTime() && date.getTime() < endDate.getTime();

export const DateRangeWithShowDisabledNavigation = ({
	mode,
	value,
	onChange,
	onRangeChange,
	modeOptions,
	className = "",
	hideTriggerLabel = false,
	triggerIcon,
}: DatePickerProps) => {
	const [datePickerMode, setDatePickerMode] = useState<DatePickerMode>(
		mode ?? "month",
	);
	const initialDateRange = getInitialDateRange(datePickerMode, value);

	const [startDate, setStartDate] = useState<Date | null>(
		initialDateRange.startDate,
	);
	const [endDate, setEndDate] = useState<Date | null>(initialDateRange.endDate);
	const [isOpen, setIsOpen] = useState(false);
	const [visibleMonth, setVisibleMonth] = useState(value ?? new Date());
	const [hoveredWeekRange, setHoveredWeekRange] = useState<{
		startDate: Date;
		endDate: Date;
	} | null>(null);
	const visibleYear = visibleMonth.getFullYear();
	const weekRange =
		datePickerMode === "week"
			? (hoveredWeekRange ??
				(startDate && endDate ? { startDate, endDate } : null))
			: null;

	useEffect(() => {
		if (!value || datePickerMode !== "month") {
			return;
		}

		const monthRange = getMonthDateRange(value);
		setStartDate(monthRange.startDate);
		setEndDate(monthRange.endDate);
	}, [datePickerMode, value]);

	useEffect(() => {
		if (!value || datePickerMode !== "single") {
			return;
		}

		setStartDate(value);
		setEndDate(value);
		setVisibleMonth(value);
	}, [datePickerMode, value]);

	const emitRangeChange = (
		mode: DatePickerMode,
		nextStartDate: Date | null,
		nextEndDate: Date | null,
	) => {
		onRangeChange?.({
			mode,
			startDate: nextStartDate,
			endDate: nextEndDate,
		});
	};

	const handleModeChange = (mode: DatePickerMode) => {
		setDatePickerMode(mode);
		setHoveredWeekRange(null);

		if (mode === "month" && value) {
			const monthRange = getMonthDateRange(value);
			setStartDate(monthRange.startDate);
			setEndDate(monthRange.endDate);
			emitRangeChange("month", monthRange.startDate, monthRange.endDate);
			return;
		}

		if (mode === "week") {
			const weekRange = getWeekDateRange(value ?? new Date());
			setStartDate(weekRange.startDate);
			setEndDate(weekRange.endDate);
			setVisibleMonth(weekRange.startDate);
			onChange(weekRange.startDate);
			emitRangeChange("week", weekRange.startDate, weekRange.endDate);
			return;
		}

		if (mode === "single") {
			const selectedDate = value ?? new Date();
			setStartDate(selectedDate);
			setEndDate(selectedDate);
			setVisibleMonth(selectedDate);
			onChange(selectedDate);
			emitRangeChange("single", selectedDate, selectedDate);
			return;
		}

		const weekRange = getWeekDateRange(new Date());
		setStartDate(weekRange.startDate);
		setEndDate(weekRange.endDate);
		setVisibleMonth(weekRange.startDate);
		onChange(weekRange.startDate);
		emitRangeChange("custom", weekRange.startDate, weekRange.endDate);
	};

	const handleMonthChange = (date: Date | null) => {
		if (!date) return;

		const monthRange = getMonthDateRange(date);
		setStartDate(monthRange.startDate);
		setEndDate(monthRange.endDate);
		onChange(monthRange.startDate);
		emitRangeChange("month", monthRange.startDate, monthRange.endDate);
		setIsOpen(false);
	};

	const handleCustomRangeChange = (range: DayPickerDateRange | undefined) => {
		const nextStartDate = range?.from ?? null;
		const nextEndDate = range?.to ?? null;
		setStartDate(nextStartDate);
		setEndDate(nextEndDate);
		onChange(nextStartDate);
		emitRangeChange("custom", nextStartDate, nextEndDate);

		if (nextStartDate && nextEndDate) {
			setIsOpen(false);
		}
	};

	const handleSingleDateChange = (date: Date | undefined) => {
		const nextDate = date ?? null;
		setStartDate(nextDate);
		setEndDate(nextDate);
		onChange(nextDate);
		emitRangeChange("single", nextDate, nextDate);

		if (nextDate) {
			setIsOpen(false);
		}
	};

	const handleWeekDateChange = (date: Date | undefined) => {
		if (!date) return;

		const weekRange = getWeekDateRange(date);
		setStartDate(weekRange.startDate);
		setEndDate(weekRange.endDate);
		setVisibleMonth(weekRange.startDate);
		onChange(weekRange.startDate);
		emitRangeChange("week", weekRange.startDate, weekRange.endDate);
		setHoveredWeekRange(null);
		setIsOpen(false);
	};

	const handleWeekDayMouseEnter = (date: Date) => {
		if (datePickerMode === "week") {
			setHoveredWeekRange(getWeekDateRange(date));
		}
	};

	const handleWeekDayMouseLeave = () => {
		setHoveredWeekRange(null);
	};

	const goToPreviousYear = () => {
		setVisibleMonth(
			(currentMonth) =>
				new Date(currentMonth.getFullYear() - 1, currentMonth.getMonth(), 1),
		);
	};

	const goToNextYear = () => {
		setVisibleMonth(
			(currentMonth) =>
				new Date(currentMonth.getFullYear() + 1, currentMonth.getMonth(), 1),
		);
	};

	const handleMonthButtonClick = (month: number) => {
		const selectedMonthDate = new Date(visibleYear, month, 1);
		setVisibleMonth(selectedMonthDate);
		handleMonthChange(selectedMonthDate);
	};

	const triggerLabel =
		datePickerMode === "month"
			? (value?.toLocaleDateString("en-US", {
					month: "long",
					year: "numeric",
				}) ?? "Select month")
			: datePickerMode === "week" && startDate && endDate
				? formatShortDateRange(startDate, endDate)
				: datePickerMode === "single"
					? startDate
						? formatShortDate(startDate)
						: "Select date"
					: startDate && endDate
						? formatShortDateRange(startDate, endDate)
						: "Select date range";

	return (
		<div className="flex flex-col sm:flex-row w-full items-center gap-2">
			{/* MODE SELECTOR */}
			{mode == null && (
				<CustomSegmentedControl
					className="w-full sm:w-auto"
					ariaLabel="Date picker mode"
					value={datePickerMode}
					options={modeOptions ?? datePickerModeOptions}
					onValueChange={handleModeChange}
				/>
			)}

			<DropdownMenu.Root open={isOpen} onOpenChange={setIsOpen}>
				<DropdownMenu.Trigger>
					<button
						type="button"
						className={`flex h-10 w-full sm:w-45 cursor-pointer items-center gap-3 rounded-lg border border-(--line) bg-popover px-3 text-sm focus:outline-primary transition hover:border-primary/40 ${className}`}
					>
						{triggerIcon ?? (
							<CalendarDays size={17} className="shrink-0 text-primary" />
						)}
						{!hideTriggerLabel && (
							<span className="truncate font-medium text-foreground">
								{triggerLabel}
							</span>
						)}
					</button>
				</DropdownMenu.Trigger>

				<DropdownMenu.Content
					align="start"
					className="z-9999! border-none! bg-transparent! p-0! shadow-none!"
				>
					<div>
						{datePickerMode === "month" ? (
							<div className={calendarSurfaceClassName}>
								<div className="flex h-10 items-center justify-between bg-primary px-3">
									<button
										type="button"
										className={headerButtonClassName}
										onClick={goToPreviousYear}
										aria-label="Previous year"
									>
										<ChevronLeft size={16} strokeWidth={2.5} />
									</button>
									<span className="text-sm font-semibold text-primary-foreground">
										{visibleYear}
									</span>
									<button
										type="button"
										className={headerButtonClassName}
										onClick={goToNextYear}
										aria-label="Next year"
									>
										<ChevronRight size={16} strokeWidth={2.5} />
									</button>
								</div>
								<div className="grid w-45 grid-cols-3 gap-2 p-2">
									{getAllMonthShortNames.map((monthName, month) => {
										const isSelected =
											value?.getFullYear() === visibleYear &&
											value.getMonth() === month;

										return (
											<button
												key={monthName}
												type="button"
												className={`h-7 whitespace-nowrap rounded-lg text-sm transition ${
													isSelected
														? "bg-primary text-primary-foreground"
														: "text-(--sea-ink-soft) hover:bg-primary/30 hover:text-(--sea-ink)"
												}`}
												onClick={() => handleMonthButtonClick(month)}
											>
												{monthName}
											</button>
										);
									})}
								</div>
							</div>
						) : datePickerMode === "single" || datePickerMode === "week" ? (
							<div className="rounded-lg border border-(--line) bg-popover text-(--sea-ink-soft)">
								<DayPicker
									animate
									captionLayout="label"
									navLayout="around"
									mode="single"
									selected={startDate ?? undefined}
									onSelect={
										datePickerMode === "week"
											? handleWeekDateChange
											: handleSingleDateChange
									}
									month={visibleMonth}
									onMonthChange={setVisibleMonth}
									showOutsideDays
									classNames={dayPickerClassNames}
									modifiers={
										weekRange
											? {
													week_range_start: (date) =>
														isSameDate(date, weekRange.startDate),
													week_range_middle: (date) =>
														isBetweenDates(
															date,
															weekRange.startDate,
															weekRange.endDate,
														),
													week_range_end: (date) =>
														isSameDate(date, weekRange.endDate),
												}
											: undefined
									}
									modifiersClassNames={weekRangeModifierClassNames}
									onDayMouseEnter={
										datePickerMode === "week"
											? handleWeekDayMouseEnter
											: undefined
									}
									onDayMouseLeave={
										datePickerMode === "week"
											? handleWeekDayMouseLeave
											: undefined
									}
									styles={dayPickerStyles}
								/>
							</div>
						) : (
							<div className="rounded-lg border border-(--line) bg-popover text-(--sea-ink-soft)">
								<DayPicker
									animate
									captionLayout="label"
									navLayout="around"
									mode="range"
									selected={{
										from: startDate ?? undefined,
										to: endDate ?? undefined,
									}}
									onSelect={handleCustomRangeChange}
									month={visibleMonth}
									onMonthChange={setVisibleMonth}
									showOutsideDays
									resetOnSelect
									classNames={dayPickerClassNames}
									styles={dayPickerStyles}
								/>
							</div>
						)}
					</div>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>
	);
};
