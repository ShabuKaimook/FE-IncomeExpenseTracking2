import type { TransactionSummaryPeriodMode } from "@/features/transactions/api/TransactionRequest";
import {
	dateToString,
	formatShortDateRange,
	getMonthDateRange,
	getWeekDateRange,
} from "@/shared/utils/date";

export type TrendMode = TransactionSummaryPeriodMode | "custom";

export type TrendPeriod = {
	label: string;
	startDate: Date;
	endDate: Date;
};

const shortDateFormatter = new Intl.DateTimeFormat("en-US", {
	day: "numeric",
	month: "short",
});

const monthFormatter = new Intl.DateTimeFormat("en-US", {
	month: "short",
	year: "numeric",
});

const startOfDay = (date: Date) =>
	new Date(date.getFullYear(), date.getMonth(), date.getDate());

const endOfDay = (date: Date) =>
	new Date(
		date.getFullYear(),
		date.getMonth(),
		date.getDate(),
		23,
		59,
		59,
		999,
	);

const addDays = (date: Date, days: number) =>
	new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);

const makeDayPeriod = (date: Date): TrendPeriod => ({
	label: shortDateFormatter.format(date),
	startDate: startOfDay(date),
	endDate: endOfDay(date),
});

const makeWeekPeriod = (date: Date): TrendPeriod => {
	const range = getWeekDateRange(date);

	return {
		label: `${shortDateFormatter.format(range.startDate)} - ${shortDateFormatter.format(range.endDate)}`,
		startDate: range.startDate,
		endDate: range.endDate,
	};
};

const makeMonthPeriod = (date: Date): TrendPeriod => {
	const range = getMonthDateRange(date);

	return {
		label: monthFormatter.format(date),
		startDate: range.startDate,
		endDate: range.endDate,
	};
};

export function getLatestTrendPeriods(
	mode: TransactionSummaryPeriodMode,
	now = new Date(),
): TrendPeriod[] {
	if (mode === "day") {
		return Array.from({ length: 7 }, (_, index) =>
			makeDayPeriod(addDays(now, index - 6)),
		);
	}

	if (mode === "week") {
		return Array.from({ length: 4 }, (_, index) =>
			makeWeekPeriod(addDays(now, (index - 3) * 7)),
		);
	}

	return Array.from({ length: 12 }, (_, index) =>
		makeMonthPeriod(
			new Date(now.getFullYear(), now.getMonth() + index - 11, 1),
		),
	);
}

export function getCustomTrendPeriods(
	startDate: Date | null,
	endDate: Date | null,
): TrendPeriod[] {
	if (!startDate || !endDate) {
		return [];
	}

	const firstDate = startDate <= endDate ? startDate : endDate;
	const lastDate = startDate <= endDate ? endDate : startDate;
	const periods: TrendPeriod[] = [];

	for (
		let date = startOfDay(firstDate);
		date <= lastDate;
		date = addDays(date, 1)
	) {
		periods.push(makeDayPeriod(date));
	}

	return periods;
}

export function getTrendDescription(mode: TrendMode, periods: TrendPeriod[]) {
	if (mode === "day") {
		return "Last 7 days, including today";
	}

	if (mode === "week") {
		return "Last 4 weeks, including this week";
	}

	if (mode === "month") {
		return "Last 12 months, including this month";
	}

	const firstPeriod = periods.at(0);
	const lastPeriod = periods.at(-1);

	if (!firstPeriod || !lastPeriod) {
		return "Choose a custom date range";
	}

	return formatShortDateRange(firstPeriod.startDate, lastPeriod.endDate);
}

export const getPeriodKey = (period: { startDate: Date; endDate: Date }) =>
	`${dateToString(period.startDate)}:${dateToString(period.endDate)}`;
