type DateInput = Date | number | string;

const secondsInMinute = 60;
const secondsInHour = secondsInMinute * 60;
const secondsInDay = secondsInHour * 24;

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
