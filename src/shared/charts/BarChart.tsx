import { useId } from "react";
import {
	Bar,
	CartesianGrid,
	Legend,
	BarChart as RechartsBarChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { resolveColor } from "@/shared/utils/ResolveCSSColor";

interface BarSeries {
	dataKey: string;
	name?: string;
	color: string;
	gradient?: boolean;
	stackId?: string;
}

interface BarChartProps<T extends Record<string, unknown>> {
	data: T[];
	xKey: keyof T;
	bars: BarSeries[];
	height?: number;
	showGrid?: boolean;
	showLabels?: boolean;
	showYAxis?: boolean;
	valueFormatter?: (value: number) => string;
	tooltipValueFormatter?: (value: number) => string;
	legendVerticalAlign?: "top" | "bottom";
	xAxisLabel?: string;
	yAxisLabel?: string;
}

interface BarLabelProps {
	x?: string | number;
	y?: string | number;
	width?: string | number;
	value?: unknown;
	valueFormatter?: (value: number) => string;
}

const renderCustomBarLabel = ({
	x,
	y,
	width,
	value,
	valueFormatter,
}: BarLabelProps) => {
	const labelX = Number(x ?? 0);
	const labelY = Number(y ?? 0);
	const labelWidth = Number(width ?? 0);
	const labelValue = Number(value);
	const label = valueFormatter?.(labelValue) ?? `${value}`;

	return (
		<text
			x={labelX + labelWidth / 2}
			y={labelY}
			fill="var(--muted-foreground)"
			textAnchor="middle"
			dy={-6}
		>
			{label}
		</text>
	);
};

export function BarChart<T extends Record<string, unknown>>({
	data,
	bars,
	xKey,
	height = 240,
	showGrid = false,
	showYAxis = false,
	showLabels = false,
	valueFormatter,
	tooltipValueFormatter,
	legendVerticalAlign = "top",
	xAxisLabel = "",
	yAxisLabel = "",
}: BarChartProps<T>) {
	const id = useId();

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

	return (
		<ResponsiveContainer
			width="100%"
			height={height}
			className="text-xs lg:text-sm"
		>
			<RechartsBarChart
				data={data}
				margin={{
					top: 20,
					right: 10,
					left: yAxisLabel !== "" ? 60 : 10,
					bottom: 20,
				}}
			>
				{showGrid && <CartesianGrid vertical={false} strokeDasharray="3 3" />}

				<XAxis
					dataKey={xKey as string}
					axisLine={false}
					tickLine={false}
					label={{
						position: "centerBottom",
						value: xAxisLabel,
						dy: 20,
					}}
				/>

				{showYAxis && (
					<YAxis
						axisLine={false}
						tickLine={false}
						tickFormatter={(value) =>
							valueFormatter ? valueFormatter(Number(value)) : value
						}
						label={{
							value: yAxisLabel,
							angle: -90,
							position: "centerTop",
							dx: -60,
						}}
					/>
				)}

				<Tooltip
					cursor={{ fill: "rgba(0,0,0,0.04)" }}
					formatter={
						tooltipValueFormatter
							? (value, name) => [tooltipValueFormatter(Number(value)), name]
							: undefined
					}
				/>
				{bars.length > 1 && (
					<Legend
						verticalAlign={legendVerticalAlign}
						align={legendVerticalAlign === "bottom" ? "center" : "right"}
					/>
				)}

				<defs>
					{bars.map((bar) => {
						return (
							<linearGradient
								key={bar.dataKey}
								id={`${id}-${bar.dataKey}-gradient`}
								x1="0"
								y1="0"
								x2="0"
								y2="1"
							>
								<stop
									offset="0%"
									stopColor={resolveColor(bar.color)}
									stopOpacity={1}
								/>
								<stop
									offset="100%"
									stopColor={resolveColor(bar.color)}
									stopOpacity={0.8}
								/>
							</linearGradient>
						);
					})}
				</defs>

				{bars.map((bar) => {
					return (
						<Bar
							key={bar.dataKey}
							dataKey={bar.dataKey}
							name={bar.name}
							fill={
								bar.gradient
									? `url(#${id}-${bar.dataKey}-gradient)`
									: resolveColor(bar.color)
							}
							label={
								showLabels
									? (props) =>
											renderCustomBarLabel({ ...props, valueFormatter })
									: undefined
							}
							radius={[8, 8, 0, 0]}
						/>
					);
				})}
			</RechartsBarChart>
		</ResponsiveContainer>
	);
}
