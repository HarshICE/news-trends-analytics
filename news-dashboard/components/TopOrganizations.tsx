"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

type PersonData = {
  keyword: string;
  count: number;
};

export default function TopPeople({
  data,
}: {
  data: PersonData[];
}) {
  return (
    <div className="border rounded-lg p-4 shadow">
      <h2 className="text-xl font-bold mb-4">
        Top Organizations
      </h2>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{
            left: -20,
            right: 20
          }}
        >
          <XAxis type="number" />

          <YAxis
            type="category"
            dataKey="keyword"
            width={180}
          />

          <Tooltip />

          <Bar
            dataKey="count"
            fill="#10b981"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}