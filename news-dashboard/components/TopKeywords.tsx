"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

type KeywordData = {
  keyword: string;
  count: number;
};

export default function TopKeywords({
  data,
}: {
  data: KeywordData[];
}) {
  return (
    <div className="border rounded-lg p-4 shadow">
      <h2 className="text-xl font-bold mb-4">
        Top Keywords
      </h2>

      <ResponsiveContainer width="100%" height={500}>
        <BarChart
        data={data}
        layout="vertical"
        margin={{
        top: 20,
        right: 50,
        left: -80,
        bottom: 20,
        }}
        >
        <XAxis
        type="number"
        tick={{ fill: "#ffffff" }}
        />

        <YAxis
        type="category"
        dataKey="keyword"
        width={200}
        tick={{
        fill: "#ffffff",
        fontSize: 14,
        }}
        />

        <Tooltip />

        <Bar
        dataKey="count"
        fill="#3b82f6"
        />
        </BarChart>
        </ResponsiveContainer>
    </div>
  );
}