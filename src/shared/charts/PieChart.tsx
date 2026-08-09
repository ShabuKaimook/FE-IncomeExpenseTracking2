import {
	Cell,
	Pie,
	PieChart as RechartsPieChart,
	ResponsiveContainer,
	Tooltip,
} from "recharts";
import { formatNumber } from "@/shared/utils/FormatMoney";

function hash(str: string) {
	let h = 0;

	for (let i = 0; i < str.length; i++) {
		h = str.charCodeAt(i) + ((h << 5) - h);
	}

	return Math.abs(h);
}

function colorFromName(name: string) {
	return `oklch(70% 0.18 ${hash(name) % 360})`;
}

export interface PieChartProps {
	data: { name: string; value: number }[];
	width?: number | `${number}%`;
	height?: number;
	innerRadius?: number;
	outerRadius?: number;
	colors?: string[];
	maxLegendItems?: number;
}

function formatPercent(value: number, total: number) {
	if (total <= 0) {
		return "0%";
	}

	return `${Math.round((value / total) * 100)}%`;
}

export function PieChart({
	data,
	width = "100%",
	height = 240,
	innerRadius = 40,
	outerRadius = 60,
	colors,
	maxLegendItems = 4,
}: PieChartProps) {
	if (data.length === 0) {
		return (
			<div
				className="flex w-full items-center justify-center"
				style={{ height }}
			>
				<span className="text-muted-foreground">No data available</span>
			</div>
		);
	}

	const total = data.reduce((sum, item) => sum + item.value, 0);
	const chartSize = Math.max(height, outerRadius * 2 + 20);
	const getColor = (entry: { name: string }, index: number) =>
		colors?.[index] ?? colorFromName(entry.name);

	return (
		<div
			className="flex flex-col items-center gap-4 lg:flex-row"
			style={{ width }}
		>
			<div className="shrink-0" style={{ width: chartSize, height: chartSize }}>
				<ResponsiveContainer width="100%" height="100%">
					<RechartsPieChart>
						<Pie
							data={data}
							dataKey="value"
							nameKey="name"
							cx="50%"
							cy="50%"
							innerRadius={innerRadius}
							outerRadius={outerRadius}
							paddingAngle={2}
							isAnimationActive={true}
						>
							{data.map((entry, index) => (
								<Cell key={entry.name} fill={getColor(entry, index)} />
							))}
						</Pie>
						<Tooltip
							formatter={(value, name) => [
								`${formatNumber(Number(value))} (${formatPercent(Number(value), total)})`,
								name,
							]}
						/>
					</RechartsPieChart>
				</ResponsiveContainer>
			</div>

			<div className="w-full max-w-[300px] min-w-0 flex-1 space-y-2 lg:max-w-none lg:w-auto">
				{data.slice(0, maxLegendItems).map((entry, index) => (
					<div key={entry.name} className="flex items-center gap-2">
						<div
							className="size-3 shrink-0 rounded-full"
							style={{ backgroundColor: getColor(entry, index) }}
						/>
						<span className="min-w-0 flex-1 truncate text-xs text-muted-foreground lg:text-sm">
							{entry.name}
						</span>
						<span className="text-xs font-medium text-foreground lg:text-sm">
							{formatPercent(entry.value, total)}
						</span>
					</div>
				))}
			</div>
		</div>
	);
}
