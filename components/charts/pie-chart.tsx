"use client";

import { Cell, Pie, PieChart as RePieChart, ResponsiveContainer, Tooltip } from "recharts";

type Item = {
  label: string;
  value: number;
};

type Props = {
  data: Item[];
};

const COLORS = ["#171717", "#404040", "#737373", "#a3a3a3", "#d4d4d4", "#525252"];

export function PieChart({ data }: Props) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RePieChart>
          <Pie data={data} dataKey="value" nameKey="label" outerRadius={110} innerRadius={55} paddingAngle={3}>
            {data.map((item, index) => (
              <Cell key={item.label} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </RePieChart>
      </ResponsiveContainer>
    </div>
  );
}
