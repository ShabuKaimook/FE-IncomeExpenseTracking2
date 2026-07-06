import {
  Pie,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Cell,
  Legend,
  Tooltip,
} from "recharts";
import type { PieLabelRenderProps } from "recharts";

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
}

export function PieChart({
  data,
  width = 200,
  height = 200,
  innerRadius = 40,
  outerRadius = 80,
}: PieChartProps) {
  return (
    <ResponsiveContainer width={width} height={height}>
      <RechartsPieChart className="flex">
        <Pie
          data={data}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          isAnimationActive={true}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colorFromName(entry.name)} />
          ))}
        </Pie>
        {data.length > 1 && (
          <Legend
            verticalAlign="top"
            align="right"
            layout="vertical"
            iconType="circle"
            formatter={(value) => (
              <span className="text-xs lg:text-sm">{value}</span>
            )}
          />
        )}
        <Tooltip />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
}
