export function getThisMonthRange() {
	const now = new Date();
	const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
	const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

	return {
		startDate,
		endDate,
	};
}

export function getThisMonthDateRange(date: Date) {
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

export const getAllMonthShortNames = Array.from({ length: 12 }, (_, month) =>
	new Date(2026, month, 1).toLocaleDateString("en-US", { month: "short" }),
);

export const toMonthValue = (date: Date) =>
	`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

export const fromMonthValue = (monthValue: string) => {
	const [year, month] = monthValue.split("-").map(Number);

	return new Date(year, month - 1, 1);
};

export const toDateOnly = (date: Date) =>
	`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
		date.getDate(),
	).padStart(2, "0")}`;

export function getThisWeekDateRange(date: Date) {
	const day = date.getDay();
	const daysSinceMonday = day === 0 ? 6 : day - 1;
	const startDate = new Date(date);
	startDate.setDate(date.getDate() - daysSinceMonday);
	startDate.setHours(0, 0, 0, 0);

	const endDate = new Date(startDate);
	endDate.setDate(startDate.getDate() + 6);
	endDate.setHours(23, 59, 59, 999);

	return {
		startDate,
		endDate,
	};
}

export function getLastMonthRange() {
	const now = new Date();
	const startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
	const endDate = new Date(now.getFullYear(), now.getMonth(), 0);

	return {
		startDate,
		endDate,
	};
}
