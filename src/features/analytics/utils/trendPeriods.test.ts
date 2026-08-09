import { describe, expect, it } from "vitest";
import { dateToString } from "@/shared/utils/date";
import {
	getCompactMonthPeriodLabel,
	getCustomTrendPeriodMode,
	getCustomTrendPeriods,
	getLatestTrendPeriods,
} from "./trendPeriods";

describe("getLatestTrendPeriods", () => {
	const now = new Date(2026, 7, 8);

	it("returns latest 7 days including today", () => {
		const periods = getLatestTrendPeriods("day", now);

		expect(periods).toHaveLength(7);
		expect(dateToString(periods[0].startDate)).toBe("2026-08-02");
		expect(dateToString(periods[6].startDate)).toBe("2026-08-08");
	});

	it("returns latest 4 Sunday-Saturday weeks including this week", () => {
		const periods = getLatestTrendPeriods("week", now);

		expect(periods).toHaveLength(4);
		expect(periods[3].label).toBe("Aug 2 - Aug 8");
		expect(dateToString(periods[0].startDate)).toBe("2026-07-12");
		expect(dateToString(periods[3].startDate)).toBe("2026-08-02");
		expect(dateToString(periods[3].endDate)).toBe("2026-08-08");
	});

	it("caps the current week period at today", () => {
		const periods = getLatestTrendPeriods("week", new Date(2026, 7, 5));

		expect(periods[3].label).toBe("Aug 2 - Aug 5");
		expect(dateToString(periods[3].endDate)).toBe("2026-08-05");
	});

	it("returns latest 12 months including this month", () => {
		const periods = getLatestTrendPeriods("month", now);

		expect(periods).toHaveLength(12);
		expect(dateToString(periods[0].startDate)).toBe("2025-09-01");
		expect(dateToString(periods[11].startDate)).toBe("2026-08-01");
		expect(dateToString(periods[11].endDate)).toBe("2026-08-08");
	});

	it("returns one daily period per custom range day", () => {
		const periods = getCustomTrendPeriods(
			new Date(2026, 7, 7),
			new Date(2026, 7, 9),
		);

		expect(periods).toHaveLength(3);
		expect(dateToString(periods[0].startDate)).toBe("2026-08-07");
		expect(dateToString(periods[2].startDate)).toBe("2026-08-09");
	});

	it("returns one monthly period per full-month custom range", () => {
		const periods = getCustomTrendPeriods(
			new Date(2026, 6, 1),
			new Date(2026, 8, 30, 23, 59, 59, 999),
		);

		expect(periods).toHaveLength(3);
		expect(periods.map((period) => period.label)).toEqual([
			"Jul 2026",
			"Aug 2026",
			"Sep 2026",
		]);
		expect(dateToString(periods[0].startDate)).toBe("2026-07-01");
		expect(dateToString(periods[2].endDate)).toBe("2026-09-30");
		expect(
			getCustomTrendPeriodMode(
				new Date(2026, 6, 1),
				new Date(2026, 8, 30, 23, 59, 59, 999),
			),
		).toBe("month");
	});

	it("uses compact month labels based on year context", () => {
		const sameYearPeriods = getCustomTrendPeriods(
			new Date(2026, 6, 1),
			new Date(2026, 8, 30, 23, 59, 59, 999),
		);
		const crossYearPeriods = getCustomTrendPeriods(
			new Date(2026, 11, 1),
			new Date(2027, 1, 28, 23, 59, 59, 999),
		);

		expect(
			getCompactMonthPeriodLabel(sameYearPeriods[0], sameYearPeriods),
		).toBe("Jul");
		expect(
			getCompactMonthPeriodLabel(crossYearPeriods[0], crossYearPeriods),
		).toBe("Dec 26");
		expect(
			getCompactMonthPeriodLabel(crossYearPeriods[1], crossYearPeriods),
		).toBe("Jan 27");
	});
});
