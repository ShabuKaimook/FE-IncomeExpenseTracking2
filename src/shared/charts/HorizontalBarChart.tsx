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

interface HorizontalBarSeries {
	dataKey: string;
	name?: string;
	color: string;
	gradient?: boolean;
}

interface HorizontalBarChartProps<T extends Record<string, unknown>> {
	data: T[];
	yKey: keyof T;
	bars: HorizontalBarSeries[];
	height?: number;
	barSize?: number;
	showGrid?: boolean;
	valueFormatter?: (value: number) => string;
	tooltipValueFormatter?: (value: number) => string;
	tooltipLabelFormatter?: (
		label: unknown,
		payload: readonly unknown[],
	) => string;
	legendVerticalAlign?: "top" | "bottom";
}

export function HorizontalBarChart<T extends Record<string, unknown>>({
	data,
	bars,
	yKey,
	height = 280,
	barSize,
	showGrid = false,
	valueFormatter,
	tooltipValueFormatter,
	tooltipLabelFormatter,
	legendVerticalAlign = "bottom",
}: HorizontalBarChartProps<T>) {
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
				layout="vertical"
				margin={{ top: 8, right: 12, left: 20, bottom: 12 }}
				barCategoryGap="28%"
				barGap={4}
			>
				{showGrid && <CartesianGrid horizontal={false} strokeDasharray="3 3" />}
				<XAxis
					type="number"
					axisLine={false}
					tickLine={false}
					tickFormatter={(value) =>
						valueFormatter
							? valueFormatter(Math.abs(Number(value)))
							: String(Math.abs(Number(value)))
					}
				/>
				<YAxis
					type="category"
					dataKey={yKey as string}
					axisLine={false}
					tickLine={false}
					width={76}
				/>
				<Tooltip
					cursor={{ fill: "rgba(0,0,0,0.04)" }}
					labelFormatter={tooltipLabelFormatter}
					formatter={
						tooltipValueFormatter
							? (value, name) => [
									tooltipValueFormatter(Math.abs(Number(value))),
									name,
								]
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
					{bars.map((bar) => (
						<linearGradient
							key={bar.dataKey}
							id={`${id}-${bar.dataKey}-gradient`}
							x1="0"
							y1="0"
							x2="1"
							y2="0"
						>
							<stop
								offset="0%"
								stopColor={resolveColor(bar.color)}
								stopOpacity={0.8}
							/>
							<stop
								offset="100%"
								stopColor={resolveColor(bar.color)}
								stopOpacity={1}
							/>
						</linearGradient>
					))}
				</defs>
				{bars.map((bar) => (
					<Bar
						key={bar.dataKey}
						dataKey={bar.dataKey}
						name={bar.name}
						barSize={barSize}
						fill={
							bar.gradient
								? `url(#${id}-${bar.dataKey}-gradient)`
								: resolveColor(bar.color)
						}
						radius={[0, 8, 8, 0]}
					/>
				))}
			</RechartsBarChart>
		</ResponsiveContainer>
	);
}
