import { createFileRoute, Link } from "@tanstack/react-router";
import {
	Activity,
	ChartBarBig,
	ChartNoAxesCombined,
	ClockFading,
	TrendingUp,
	Wallet,
	WalletCards,
} from "lucide-react";
import { BarChart } from "#/components/charts/Barchart";
import { PieChart } from "#/components/charts/PieChart";
import { DashboardCard } from "#/components/DashboardCard";
import {
	type Transaction,
	TransactionCard,
} from "#/components/TransactionCard";
import { ChartTheme } from "#/constants/ChartTheme.enum";
import { TRANSACTION_TYPE } from "#/constants/TransactionType.enum";

export const Route = createFileRoute("/")({ component: Home });

const MOCK_SPENDING_TREND_DATA = [
	{ month: "Jan", expense: 10080 },
	{ month: "Feb", expense: 20092 },
	{ month: "Mar", expense: 8885 },
	{ month: "Apr", expense: 9997 },
	{ month: "May", expense: 19088 },
	{ month: "Jun", expense: 19295 },
	{ month: "Jul", expense: 11101 },
];

const MOCK_EXPENSE_CATEGORY_DATA = [
	{ name: "Food", value: 400 },
	{ name: "Transport", value: 300 },
	{ name: "Entertainment", value: 300 },
	{ name: "Health", value: 200 },
	{ name: "Education", value: 278 },
	{ name: "Others", value: 189 },
];

const MOCK_TRANSACTION_HISTORY_DATA: Transaction[] = [
	{
		id: 1,
		date: "2023-07-01",
		description: "Grocery Shopping",
		amount: 50.25,
		currency: "USD",
		category: "Food",
		type_id: TRANSACTION_TYPE.EXPENSE.id,
    type_name: TRANSACTION_TYPE.EXPENSE.name,
	},
	{
		id: 2,
		date: "2023-07-02",
		description: "Salary",
		amount: 2000.0,
		currency: "USD",
		category: "Income",
		type_id: TRANSACTION_TYPE.INCOME.id,
    type_name: TRANSACTION_TYPE.INCOME.name,
	},
	{
		id: 3,
		date: "2023-07-03",
		description: "Electricity Bill",
		amount: 75.5,
		currency: "USD",
		category: "Utilities",
		type_id: TRANSACTION_TYPE.EXPENSE.id,
    type_name: TRANSACTION_TYPE.EXPENSE.name,
	},
	{
		id: 4,
		date: "2023-07-04",
		description: "Dinner at Restaurant",
		amount: 80.0,
		currency: "USD",
		category: "Food",
		type_id: TRANSACTION_TYPE.EXPENSE.id,
    type_name: TRANSACTION_TYPE.EXPENSE.name,
	},
	{
		id: 5,
		date: "2023-07-05",
		description: "Freelance Project",
		amount: 500.0,
		currency: "USD",
		category: "Income",
		type_id: TRANSACTION_TYPE.INCOME.id,
    type_name: TRANSACTION_TYPE.INCOME.name,
	},
];

function Home() {
	return (
		<div className="flex flex-col items-center justify-center gap-4">
			{/* Net, Income, Expense, Saving Rate Section */}
			<div className="flex flex-col lg:flex-row gap-4 w-full">
				{/* Net Card */}
				<DashboardCard
					header={{
						icon: <Wallet size={16} className="text-primary" />,
						title: "NET BALANCE",
					}}
					rightSide={
						<div className="flex items-center gap-2 text-xs lg:text-sm bg-primary/20 px-3 py-1 rounded-2xl">
							<span className="text-primary">Positive</span>
						</div>
					}
					children={
						<span className="text-2xl font-bold text-primary lg:text-4xl">
							$ 0.00
						</span>
					}
					bottomSide={
						<div className="mt-2 flex w-full items-center justify-between border-t pt-3 text-xs text-muted-foreground lg:text-sm">
							<span>Last updated: Today</span>
						</div>
					}
				/>

				{/* Income/Expense Card */}
				<DashboardCard
					header={{
						icon: <ChartBarBig size={16} className="text-primary" />,
						title: "INCOME & EXPENSE",
					}}
					children={
						<div className="flex gap-4 w-full">
							<DashboardCard
								leftSide={
									<span className="text-xs text-muted-foreground lg:text-sm">
										Income
									</span>
								}
								rightSide={<TrendingUp size={16} className="text-primary" />}
								bgColor="bg-linear-[150deg] from-primary/50 to-primary/10 text-white"
								children={
									<span className="text-lg font-bold text-muted-foreground lg:text-xl">
										$ 0.00
									</span>
								}
							/>

							<DashboardCard
								leftSide={
									<span className="text-xs text-muted-foreground lg:text-sm">
										Expense
									</span>
								}
								rightSide={
									<TrendingUp size={16} className="text-destructive" />
								}
								bgColor="bg-linear-[150deg] from-destructive/50 to-destructive/10 text-white"
								children={
									<span className="text-lg font-bold text-muted-foreground lg:text-xl">
										$ 0.00
									</span>
								}
							/>
						</div>
					}
				/>

				{/* Saving Card */}
				<DashboardCard
					header={{
						icon: <ChartNoAxesCombined size={16} className="text-primary" />,
						title: "SAVING",
					}}
					children={
						<span className="text-2xl font-bold text-primary lg:text-4xl">
							$ 0.00
						</span>
					}
					bottomSide={
						<div className="mt-2 flex w-full items-center justify-between border-t pt-3 text-xs text-muted-foreground lg:text-sm">
							<span>+4.1% from last month</span>
						</div>
					}
				/>
			</div>

			{/* Chart Section */}
			<div className="flex flex-col sm:flex-row gap-4 w-full">
				{/* Spending Trend Chart */}
				<DashboardCard
					header={{
						icon: <Activity size={16} className="text-primary" />,
						title: "SPENDING TREND",
					}}
					rightSide={
						<div className="flex items-center gap-2 text-xs lg:text-sm bg-primary/20 px-3 py-1 rounded-2xl">
							{/* TODO: link the path */}
							<Link to="/analytic" className="text-primary cursor-pointer">
								<span className="text-primary cursor-pointer">View More</span>
							</Link>
						</div>
					}
					children={
						<BarChart
							data={MOCK_SPENDING_TREND_DATA}
							xKey="month"
							bars={[
								{
									dataKey: "expense",
									name: "Expense",
									color: ChartTheme.destructive.color,
									gradient: true,
								},
							]}
							height={200}
							showYAxis={true}
						/>
					}
				/>

				{/* Expesnse Category */}
				<DashboardCard
					header={{
						icon: <ClockFading size={16} className="text-primary" />,
						title: "EXPENSE CATEGORY",
					}}
					rightSide={
						<div className="flex items-center gap-2 text-xs lg:text-sm bg-primary/20 px-3 py-1 rounded-2xl">
							{/* TODO: link the path */}
							<Link to="/analytic" className="text-primary cursor-pointer">
								<span className="text-primary cursor-pointer">View More</span>
							</Link>
						</div>
					}
					children={
						<PieChart
							data={MOCK_EXPENSE_CATEGORY_DATA}
							width={"100%"}
							outerRadius={70}
							height={200}
						/>
					}
				/>
			</div>

			<DashboardCard
				header={{
					icon: <WalletCards size={16} className="text-primary" />,
					title: "TRANSACTION HISTORY",
				}}

        rightSide={
						<div className="flex items-center gap-2 text-xs lg:text-sm bg-primary/20 px-3 py-1 rounded-2xl">
							{/* TODO: link the path */}
							<Link to="/transaction" className="text-primary cursor-pointer">
								<span className="text-primary cursor-pointer">View More</span>
							</Link>
						</div>
					}
			>
				<TransactionCard transactions={MOCK_TRANSACTION_HISTORY_DATA} />
			</DashboardCard>
		</div>
	);
}
