import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { type CSSProperties, useEffect, useState } from "react";
import {
  DayPicker,
  type DateRange as DayPickerDateRange,
  SelectionState,
  UI,
} from "@daypicker/react";
import "@daypicker/react/style.css";
import { SegmentedControl, DropdownMenu } from "@radix-ui/themes";
import { getThisMonthDateRange } from "@/shared/utils/Month";

type DatePickerMode = "month" | "custom";

export type DatePickerRange = {
  mode: DatePickerMode;
  startDate: Date | null;
  endDate: Date | null;
};

export interface DatePickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  onRangeChange?: (range: DatePickerRange) => void;
  className?: string;
}

const monthNames = Array.from({ length: 12 }, (_, month) =>
  new Date(2026, month, 1).toLocaleDateString("en-US", { month: "short" }),
);

const headerButtonClassName =
  "inline-flex size-7 items-center justify-center rounded-lg text-primary-foreground transition hover:bg-primary-foreground/15 disabled:cursor-not-allowed disabled:opacity-40";

const calendarSurfaceClassName =
  "overflow-hidden rounded-lg border-2 border-(--line) bg-popover shadow-sm";

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
    "rounded-r-lg bg-primary/10 [&>button]:rounded-l-none [&>button]:rounded-r-lg [&>button]:bg-primary [&>button]:text-primary-foreground",
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

const segmentedControlRootClassName = [
  "!rounded-lg",
  "border-2",
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

export const DateRangeWithShowDisabledNavigation = ({
  value,
  onChange,
  onRangeChange,
  className = "",
}: DatePickerProps) => {
  const [datePickerMode, setDatePickerMode] = useState<"month" | "custom">(
    "month",
  );
  const initialMonthRange = value ? getThisMonthDateRange(value) : null;
  const [startDate, setStartDate] = useState<Date | null>(
    initialMonthRange?.startDate ?? null,
  );
  const [endDate, setEndDate] = useState<Date | null>(
    initialMonthRange?.endDate ?? null,
  );
  const [isOpen, setIsOpen] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState(value ?? new Date());
  const visibleYear = visibleMonth.getFullYear();

  useEffect(() => {
    if (!value || datePickerMode !== "month") {
      return;
    }

    const monthRange = getThisMonthDateRange(value);
    setStartDate(monthRange.startDate);
    setEndDate(monthRange.endDate);
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

    if (mode === "month" && value) {
      const monthRange = getThisMonthDateRange(value);
      setStartDate(monthRange.startDate);
      setEndDate(monthRange.endDate);
      emitRangeChange("month", monthRange.startDate, monthRange.endDate);
      return;
    }

    setStartDate(null);
    setEndDate(null);
    emitRangeChange("custom", null, null);
  };

  const handleMonthChange = (date: Date | null) => {
    if (!date) return;

    const monthRange = getThisMonthDateRange(date);
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
      : startDate && endDate
        ? `${startDate.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })} - ${endDate.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}`
        : "Select date range";

  return (
    <div className="flex w-full items-center gap-2">
      {/* MODE SELECTOR */}
      <SegmentedControl.Root
        className={segmentedControlRootClassName}
        value={datePickerMode}
        onValueChange={(mode) => {
          if (mode === "month" || mode === "custom") {
            handleModeChange(mode);
          }
        }}
      >
        <SegmentedControl.Item
          className={segmentedControlItemClassName}
          value="month"
        >
          Month
        </SegmentedControl.Item>
        <SegmentedControl.Item
          className={segmentedControlItemClassName}
          value="custom"
        >
          Custom
        </SegmentedControl.Item>
      </SegmentedControl.Root>

      <DropdownMenu.Root open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenu.Trigger>
          <button
            type="button"
            className={`flex h-10 w-full sm:w-45 cursor-pointer items-center gap-3 rounded-lg border-2 border-(--line) bg-popover px-3 text-sm focus:outline-primary transition hover:border-primary/40 ${className}`}
          >
            <CalendarDays size={17} className="shrink-0 text-primary" />
            <span className="truncate font-medium text-foreground">
              {triggerLabel}
            </span>
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
                  {monthNames.map((monthName, month) => {
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
            ) : (
              <div className="rounded-lg border-2 border-(--line) bg-popover text-(--sea-ink-soft)">
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
