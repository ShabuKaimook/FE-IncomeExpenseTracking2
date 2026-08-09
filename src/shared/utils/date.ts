type DateInput = Date | number | string;

const secondsInMinute = 60;
const secondsInHour = secondsInMinute * 60;
const secondsInDay = secondsInHour * 24;

export function getMonthDateRange(date: Date) {
	const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
	const endDate = new Date(
		date.getFullYear(),
		date.getMonth() + 1,
		0,
		23,
		59,
		59,
		999,
	);

	return {
		startDate,
		endDate,
	};
}

export function getCurrentMonthDateRange() {
	return getMonthDateRange(new Date());
}

export const getAllMonthShortNames = Array.from({ length: 12 }, (_, month) =>
	new Date(2026, month, 1).toLocaleDateString("en-US", { month: "short" }),
);

export const dateToYearMonthString = (date: Date) =>
	`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

export const yearMonthStringToDate = (yearMonthValue: string) => {
	const [year, month] = yearMonthValue.split("-").map(Number);

	return new Date(year, month - 1, 1);
};

export const dateToString = (date: Date): string =>
	`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
		date.getDate(),
	).padStart(2, "0")}`;

export const stringToDate = (dateValue: string) => {
	const [year, month, date] = dateValue.split("-").map(Number);

	return new Date(year, month - 1, date);
};

export const formatShortDate = (date: Date) =>
	date.toLocaleDateString("en-US", {
		day: "numeric",
		month: "short",
		year: "numeric",
	});

export const formatShortDateRange = (startDate: Date, endDate: Date) =>
	`${formatShortDate(startDate)} - ${formatShortDate(endDate)}`;

export function getWeekDateRange(date: Date) {
	const day = date.getDay();
	const startDate = new Date(date);
	startDate.setDate(date.getDate() - day);
	startDate.setHours(0, 0, 0, 0);

	const endDate = new Date(startDate);
	endDate.setDate(startDate.getDate() + 6);
	endDate.setHours(23, 59, 59, 999);

	return {
		startDate,
		endDate,
	};
}

export function getPreviousMonthDateRange() {
	const now = new Date();
	return getMonthDateRange(new Date(now.getFullYear(), now.getMonth() - 1, 1));
}

const getStartOfDay = (date: Date) =>
	new Date(date.getFullYear(), date.getMonth(), date.getDate());

const formatFullDate = (date: Date) =>
	new Intl.DateTimeFormat("en-US", {
		day: "numeric",
		month: "short",
		year: "numeric",
	}).format(date);

export const formatRelativeDate = (date: DateInput, now: Date = new Date()) => {
	const parsedDate = new Date(date);

	if (Number.isNaN(parsedDate.getTime())) {
		return "";
	}

	const diffInSeconds = Math.max(
		0,
		Math.floor((now.getTime() - parsedDate.getTime()) / 1000),
	);
	const dateStart = getStartOfDay(parsedDate);
	const nowStart = getStartOfDay(now);
	const diffInDays = Math.floor(
		(nowStart.getTime() - dateStart.getTime()) / (secondsInDay * 1000),
	);

	if (diffInDays === 0) {
		if (diffInSeconds < secondsInMinute) {
			return `${Math.max(diffInSeconds, 1)} sec ago`;
		}

		if (diffInSeconds < secondsInHour) {
			return `${Math.floor(diffInSeconds / secondsInMinute)} min ago`;
		}

		return `${Math.floor(diffInSeconds / secondsInHour)} hour ago`;
	}

	if (diffInDays === 1) {
		return "Yesterday";
	}

	if (diffInDays > 1 && diffInDays < 7) {
		return `${diffInDays} days ago`;
	}

	return formatFullDate(parsedDate);
};
