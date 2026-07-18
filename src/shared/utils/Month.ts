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

export function getLastMonthRange() {
	const now = new Date();
	const startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
	const endDate = new Date(now.getFullYear(), now.getMonth(), 0);

	return {
		startDate,
		endDate,
	};
}
