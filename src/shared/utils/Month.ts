export function getThisMonthRange() {
	const now = new Date();
	const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
	const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

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
