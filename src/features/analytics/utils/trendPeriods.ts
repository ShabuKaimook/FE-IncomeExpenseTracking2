import type { TransactionSummaryPeriodMode } from "@/features/transactions/api/TransactionRequest";
import {
	dateToString,
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

const compactMonthFormatter = new Intl.DateTimeFormat("en-US", {
	month: "short",
});

const compactMonthYearFormatter = new Intl.DateTimeFormat("en-US", {
	month: "short",
	year: "2-digit",
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

const isSameDate = (leftDate: Date, rightDate: Date) =>
	leftDate.getFullYear() === rightDate.getFullYear() &&
	leftDate.getMonth() === rightDate.getMonth() &&
	leftDate.getDate() === rightDate.getDate();

export const getCustomTrendPeriodMode = (
	startDate: Date | null,
	endDate: Date | null,
): TransactionSummaryPeriodMode => {
	if (!startDate || !endDate) {
		return "day";
	}

	const firstDate = startDate <= endDate ? startDate : endDate;
	const lastDate = startDate <= endDate ? endDate : startDate;
	const firstMonthRange = getMonthDateRange(firstDate);
	const lastMonthRange = getMonthDateRange(lastDate);

	return isSameDate(firstDate, firstMonthRange.startDate) &&
		isSameDate(lastDate, lastMonthRange.endDate)
		? "month"
		: "day";
};

const capLastPeriodToToday = (
	mode: TransactionSummaryPeriodMode,
	periods: TrendPeriod[],
	now: Date,
) => {
	const lastPeriod = periods.at(-1);

	if (!lastPeriod) {
		return periods;
	}

	const todayEndDate = endOfDay(now);

	return [
		...periods.slice(0, -1),
		{
			...lastPeriod,
			label:
				mode === "week"
					? `${shortDateFormatter.format(lastPeriod.startDate)} - ${shortDateFormatter.format(todayEndDate)}`
					: lastPeriod.label,
			endDate: todayEndDate,
		},
	];
};

export function getLatestTrendPeriods(
	mode: TransactionSummaryPeriodMode,
	now = new Date(),
): TrendPeriod[] {
	if (mode === "day") {
		return capLastPeriodToToday(
			mode,
			Array.from({ length: 7 }, (_, index) =>
				makeDayPeriod(addDays(now, index - 6)),
			),
			now,
		);
	}

	if (mode === "week") {
		return capLastPeriodToToday(
			mode,
			Array.from({ length: 4 }, (_, index) =>
				makeWeekPeriod(addDays(now, (index - 3) * 7)),
			),
			now,
		);
	}

	return capLastPeriodToToday(
		mode,
		Array.from({ length: 12 }, (_, index) =>
			makeMonthPeriod(
				new Date(now.getFullYear(), now.getMonth() + index - 11, 1),
			),
		),
		now,
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

	if (getCustomTrendPeriodMode(firstDate, lastDate) === "month") {
		for (
			let date = new Date(firstDate.getFullYear(), firstDate.getMonth(), 1);
			date <= lastDate;
			date = new Date(date.getFullYear(), date.getMonth() + 1, 1)
		) {
			periods.push(makeMonthPeriod(date));
		}

		return periods;
	}

	for (
		let date = startOfDay(firstDate);
		date <= lastDate;
		date = addDays(date, 1)
	) {
		periods.push(makeDayPeriod(date));
	}

	return periods;
}

export function getTrendDescription(mode: TrendMode) {
	if (mode === "day") {
		return "Last 7 days including today";
	}

	if (mode === "week") {
		return "Last 4 weeks including this week";
	}

	if (mode === "month") {
		return "Last 12 months including this month";
	}

	return null;
}

export const getPeriodKey = (period: { startDate: Date; endDate: Date }) =>
	`${dateToString(period.startDate)}:${dateToString(period.endDate)}`;

export const isMonthPeriod = (period: TrendPeriod) => {
	const monthRange = getMonthDateRange(period.startDate);

	return (
		isSameDate(period.startDate, monthRange.startDate) &&
		isSameDate(period.endDate, monthRange.endDate)
	);
};

export const getCompactMonthPeriodLabel = (
	period: TrendPeriod,
	periods: TrendPeriod[],
) => {
	const hasMultipleYears =
		new Set(periods.map((trendPeriod) => trendPeriod.startDate.getFullYear()))
			.size > 1;

	return hasMultipleYears
		? compactMonthYearFormatter.format(period.startDate)
		: compactMonthFormatter.format(period.startDate);
};
