import { useMemo, useState } from "react";
import {
	type DatePickerRange,
	DateRangeWithShowDisabledNavigation,
} from "@/shared/components/DatePicker";
import { SearchBar } from "@/shared/components/SearchBar";
import {
	fromMonthValue,
	getThisMonthDateRange,
	toDateOnly,
	toMonthValue,
} from "@/shared/utils/date";
import NewTransactionButton from "./components/NewTransactionButton";
import type {
	TransactionGroupBy,
	TransactionGroupDirection,
} from "./components/TransactionGroupByDropdown";
import TransactionGroupByDropdown from "./components/TransactionGroupByDropdown";
import { TransactionHistory } from "./components/TransactionHistory";
import type { TransactionSortBy } from "./components/TransactionSortByDropdown";
import TransactionSortByDropdown from "./components/TransactionSortByDropdown";

export default function TransactionPage() {
	const initialRange = getThisMonthDateRange(new Date());
	const [selectedMonth, setSelectedMonth] = useState(toMonthValue(new Date()));
	const [dateRange, setDateRange] = useState<DatePickerRange>({
		mode: "month",
		startDate: initialRange.startDate,
		endDate: initialRange.endDate,
	});
	const [searchInput, setSearchInput] = useState("");
	const [search, setSearch] = useState("");
	const [groupBy, setGroupBy] = useState<TransactionGroupBy | null>(null);
	const [groupDirection, setGroupDirection] =
		useState<TransactionGroupDirection>("desc");
	const [sortBy, setSortBy] = useState<TransactionSortBy>("date");
	const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
	const baseCriteria = useMemo(
		() => ({
			...(search.trim() ? { description: search.trim() } : {}),
			...(dateRange.startDate
				? { start_date: toDateOnly(dateRange.startDate) }
				: {}),
			...(dateRange.endDate ? { end_date: toDateOnly(dateRange.endDate) } : {}),
		}),
		[dateRange.endDate, dateRange.startDate, search],
	);

	return (
		<div className="flex flex-col gap-4 relative">
			<section className="z-30 rounded-xl">
				<div className="flex flex-col gap-3 sm:flex-row lg:items-center lg:justify-between">
					<DateRangeWithShowDisabledNavigation
						value={fromMonthValue(selectedMonth)}
						onChange={(date) => {
							if (date) {
								setSelectedMonth(toMonthValue(date));
							}
						}}
						onRangeChange={setDateRange}
						className="lg:w-72"
					/>

					<NewTransactionButton />
				</div>

				<div className="mt-4 grid gap-3 md:grid-cols-[minmax(0,1.4fr)_minmax(190px,0.7fr)_minmax(220px,0.9fr)]">
					<SearchBar
						value={searchInput}
						onChange={setSearchInput}
						onSubmit={() => setSearch(searchInput)}
						placeholder="Search description"
						label="Search description"
					/>

					<div className="flex w-full min-w-0 gap-3 md:col-span-2">
						<TransactionGroupByDropdown
							value={groupBy}
							direction={groupDirection}
							onChange={setGroupBy}
							onDirectionChange={setGroupDirection}
							className="flex-1"
						/>

						<TransactionSortByDropdown
							value={sortBy}
							direction={sortDirection}
							onChange={setSortBy}
							onDirectionChange={setSortDirection}
							className="flex-1"
						/>
					</div>
				</div>
			</section>

			<TransactionHistory
				baseCriteria={baseCriteria}
				groupBy={groupBy}
				groupDirection={groupDirection}
				sortBy={sortBy}
				sortDirection={sortDirection}
			/>
		</div>
	);
}
