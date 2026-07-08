import { useId } from "react";
import { resolveColor } from "#/utils/ResolveCSSColor";
import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Bar,
  Legend,
} from "recharts";

interface BarSeries {
  dataKey: string;
  name?: string;
  color: string;
  gradient?: boolean;
  stackId?: string;
}

interface BarChartProps<T extends Record<string, any>> {
  data: T[];
  xKey: keyof T;
  bars: BarSeries[];
  height?: number;
  showGrid?: boolean;
  showLabels?: boolean;
  showYAxis?: boolean;
  xAxisLabel?: string;
  yAxisLabel?: string;
}

const renderCustomBarLabel = ({ x, y, width, value }: any) => {
  return (
    <text
      x={x + width / 2}
      y={y}
      fill="var(--muted-foreground)"
      textAnchor="middle"
      dy={-6}
    >{`${value}`}</text>
  );
};

export function BarChart<T extends Record<string, any>>({
  data,
  bars,
  xKey,
  height = 240,
  showGrid = false,
  showYAxis = false,
  showLabels = false,
  xAxisLabel = "",
  yAxisLabel = "",
}: BarChartProps<T>) {
  const id = useId();

  return (
    <ResponsiveContainer
      width="100%"
      height={height}
      className="text-xs lg:text-sm"
    >
      <RechartsBarChart
        data={data}
        margin={{ top: 20, right: 10, left: yAxisLabel !== "" ? 60 : 10, bottom: 20 }}
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
            label={{
              value: yAxisLabel,
              angle: -90,
              position: "centerTop",
              dx: -60,
            }}
          />
        )}

        <Tooltip cursor={{ fill: "rgba(0,0,0,0.04)" }} />
        {bars.length > 1 && <Legend verticalAlign="top" align="right" />}

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
              label={showLabels ? renderCustomBarLabel : undefined}
              radius={[8, 8, 0, 0]}
            />
          );
        })}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}
