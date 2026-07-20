import { Link } from "@tanstack/react-router";
import { ClockFading } from "lucide-react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useUserTransactionCategorySummary } from "@/features/userTransactionCategories/hooks/useUserTransactionCategorySummary";
import { PieChart } from "@/shared/charts/PieChart";
import { DashboardCard } from "@/shared/components/DashboardCard";
import { ChartSkeleton } from "@/shared/components/Skeleton";
import { TRANSACTION_TYPE } from "@/shared/constants/TransactionTypeEnum";
import { getThisMonthRange } from "@/shared/utils/date";

const ExpenseCategorySummaryDashboard = () => {
	const {
		summary: expenseCategorySummary,
		error,
		isLoading,
	} = useUserTransactionCategorySummary({
		periods: [
			{
				start_date: getThisMonthRange().startDate,
				end_date: getThisMonthRange().endDate,
			},
		],
		criteria: {
			transaction_type_ids: [TRANSACTION_TYPE.EXPENSE.id],
		},
	});

	useEffect(() => {
		if (error) {
			toast.error(
				"Failed to fetch expense category summary. Please try again later.",
			);
		}
	}, [error]);

	return (
		<DashboardCard
			header={{
				icon: <ClockFading size={16} className="text-primary" />,
				title: "EXPENSE CATEGORY",
			}}
			rightSide={
				!isLoading && (
					<div className="flex items-center gap-2 text-xs lg:text-sm bg-primary/20 px-3 py-1 rounded-2xl">
						{/* TODO: link the path */}
						<Link to="/analytic" className="text-primary cursor-pointer">
							<span className="text-primary cursor-pointer">View More</span>
						</Link>
					</div>
				)
			}
		>
			{isLoading ? (
				<ChartSkeleton height={200} variant="pie" />
			) : (
				<PieChart
					data={expenseCategorySummary.map((item) => ({
						name: item.user_transaction_category_name,
						value: item.amount,
					}))}
					width="100%"
					outerRadius={70}
					height={200}
				/>
			)}
		</DashboardCard>
	);
};

export default ExpenseCategorySummaryDashboard;
