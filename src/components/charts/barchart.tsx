import { useId } from "react";
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
  showYAxis?: boolean;
  color?: string;
}

function resloveColor(color: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(color);
}

export function BarChart<T extends Record<string, any>>({
  data,
  bars,
  xKey,
  height = 240,
  showGrid = false,
  showYAxis = false,
}: BarChartProps<T>) {
  const id = useId();

  return (
    <ResponsiveContainer
      width="100%"
      height={height}
      className="text-xs lg:text-sm"
    >
      <RechartsBarChart data={data}>
        {showGrid && (
          <CartesianGrid
            vertical={false}
            strokeDasharray="3 3"
            stroke="#e5e7eb"
          />
        )}

        <XAxis dataKey={xKey as string} axisLine={false} tickLine={false} />

        {showYAxis && <YAxis axisLine={false} tickLine={false} />}

        <Tooltip cursor={{ fill: "rgba(0,0,0,0.04)" }} />
        <Legend verticalAlign="top" align="right" />

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
                  stopColor={resloveColor(bar.color)}
                  stopOpacity={1}
                />
                <stop
                  offset="100%"
                  stopColor={resloveColor(bar.color)}
                  stopOpacity={0.8}
                />
              </linearGradient>
            );
          })}
        </defs>

        {bars.map((bar) => {
          console.log("color", bar.color, resloveColor(bar.color));

          return (
            <Bar
              key={bar.dataKey}
              dataKey={bar.dataKey}
              name={bar.name}
              fill={
                bar.gradient
                  ? `url(#${id}-${bar.dataKey}-gradient)`
                  : resloveColor(bar.color)
              }
              radius={[8, 8, 0, 0]}
            />
          );
        })}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}
