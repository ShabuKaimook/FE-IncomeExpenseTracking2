import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

interface BarChartProps<T extends Record<string, any>> {
  data: T[];
  xKey: keyof T;
  yKey: keyof T;
  height?: number;
  showGrid?: boolean;
  showYAxis?: boolean;
  color?: string;
}

export function BarChart<T extends Record<string, any>>({
  data,
  xKey,
  yKey,
  height = 240,
  showGrid = false,
  showYAxis = false,
  color = "#10B981",
}: BarChartProps<T>) {
  const gradientId = `gradient-${color.replace("#", "")}`;

  return (
    <ResponsiveContainer width="100%" height={height} className="text-xs lg:text-sm">
      <RechartsBarChart
        data={data}
        margin={{
          top: 10,
          right: 10,
          left: 0,
          bottom: 0,
        }}
      >
        <defs>
          <linearGradient
            id={gradientId}
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="0%" stopColor={color} stopOpacity={1} />
            <stop offset="100%" stopColor={color} stopOpacity={0.15} />
          </linearGradient>
        </defs>

        {showGrid && (
          <CartesianGrid
            vertical={false}
            strokeDasharray="3 3"
            stroke="#e5e7eb"
          />
        )}

        <XAxis
          dataKey={xKey as string}
          axisLine={false}
          tickLine={false}
          tickMargin={12}
        />

        {showYAxis && (
          <YAxis
            axisLine={false}
            tickLine={false}
          />
        )}

        <Tooltip
          cursor={{ fill: "rgba(0,0,0,0.04)" }}
        />

        <Bar
          dataKey={yKey as string}
          fill={`url(#${gradientId})`}
          radius={[10, 10, 0, 0]}
          maxBarSize={48}
        />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}