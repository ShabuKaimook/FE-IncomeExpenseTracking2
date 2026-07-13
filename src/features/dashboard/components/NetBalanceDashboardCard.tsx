import { Wallet } from "lucide-react";
import { DashboardCard } from "@/shared/components/DashboardCard";
import { LoadingSpinner } from "@/shared/components/LoadingSpinner";
import { formatMoney } from "@/shared/utils/FormatMoney";

interface NetBalanceDashboardCardProps {
	netBalance: number;
	lastUpdated: string;
	currency: string;
	isLoading: boolean;
}

export const NetBalanceDashboardCard = ({
	netBalance,
	lastUpdated,
	currency,
	isLoading,
}: NetBalanceDashboardCardProps) => {
	return (
		<DashboardCard
			header={{
				icon: <Wallet size={16} className="text-primary" />,
				title: "NET BALANCE",
			}}
			rightSide={
				<div className="flex items-center gap-2 text-xs lg:text-sm bg-primary/20 px-3 py-1 rounded-2xl">
					<span className="text-primary">
						{netBalance > 0
							? "Positive"
							: netBalance < 0
								? "Negative"
								: "Neutral"}
					</span>
				</div>
			}
			bottomSide={
				<div className="mt-2 flex w-full items-center justify-between border-t pt-3 text-xs text-muted-foreground lg:text-sm">
					<span>Last updated: {lastUpdated}</span>
				</div>
			}
		>
			<span className="text-2xl font-bold text-primary lg:text-4xl">
				{isLoading ? (
					<LoadingSpinner size={32} label="Loading net balance" />
				) : (
					formatMoney(netBalance, currency)
				)}
			</span>
		</DashboardCard>
	);
};

export default NetBalanceDashboardCard;
