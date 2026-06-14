type StatsCardProps = {
  title: string;
  value: number | null;
};

export default function StatsCard({
  title,
  value,
}: StatsCardProps) {
  return (
    
    <div className="border rounded-lg p-6 shadow">
    <p className="text-gray-500">{title}</p>

    <h2 className="text-3xl font-bold">
        {value ?? 0}
    </h2>
    </div>
    
  );
}