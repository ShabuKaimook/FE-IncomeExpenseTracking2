import { Wallet } from "lucide-react";
import { useEffect } from "react";
import { useTransactionLastUpdated } from "@/features/transactions/hooks/useTransactionLastUpdated";
import { DashboardCard } from "@/shared/components/DashboardCard";
import { Skeleton } from "@/shared/components/Skeleton";
import { formatRelativeDate } from "@/shared/utils/date";
import { formatMoney } from "@/shared/utils/FormatMoney";

interface NetBalanceDashboardCardProps {
	netBalance: number;
	currency: string;
	isLoading: boolean;
}

export const NetBalanceDashboardCard = ({
	netBalance,
	currency,
	isLoading,
}: NetBalanceDashboardCardProps) => {
	const {
		lastUpdated,
		error,
		isLoading: isLoadingLastUpdated,
	} = useTransactionLastUpdated();

	useEffect(() => {
		if (error) {
			console.error("Error fetching last updated time:", error);
		}
	}, [error]);

	return (
		<DashboardCard
			header={{
				icon: <Wallet size={16} className="text-primary" />,
				title: "NET BALANCE",
			}}
			rightSide={
				!isLoading && (
					<div className="flex items-center gap-2 text-xs lg:text-sm bg-primary/20 px-3 py-1 rounded-2xl">
						<span className="text-primary">
							{netBalance > 0
								? "Positive"
								: netBalance < 0
									? "Negative"
									: "Neutral"}
						</span>
					</div>
				)
			}
			bottomSide={
				<div className="mt-2 flex w-full items-center justify-between border-t pt-3 text-xs text-muted-foreground lg:text-sm">
					{isLoading || isLoadingLastUpdated ? (
						<Skeleton className="h-4 w-40" label="Loading last updated time" />
					) : (
						<span>
							Last updated:{" "}
							{lastUpdated
								? formatRelativeDate(lastUpdated)
								: "No transactions updated"}
						</span>
					)}
				</div>
			}
		>
			<span className="text-2xl font-bold text-primary lg:text-4xl">
				{isLoading ? (
					<Skeleton
						className="h-10 w-48 rounded-lg"
						label="Loading net balance"
					/>
				) : (
					formatMoney(netBalance, currency)
				)}
			</span>
		</DashboardCard>
	);
};

export default NetBalanceDashboardCard;
