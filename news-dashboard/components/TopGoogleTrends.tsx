"use client";

type TrendData = {
  trend_name: string;
  traffic?: string;
};

export default function TopGoogleTrends({
  data,
}: {
  data: TrendData[];
}) {
  return (
    <div className="border rounded-lg p-4 shadow">
      <h2 className="text-xl font-bold mb-4">
        Top Google Trends
      </h2>

      <div className="space-y-3">
        {data.map((trend, index) => (
          <div
            key={`${trend.trend_name}-${index}`}
            className="flex justify-between items-center border-b border-gray-800 pb-2"
          >
            <span className="font-medium">
              {trend.trend_name}
            </span>

            <span className="text-sm text-gray-400">
              {trend.traffic || "Trending"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}