export const dynamic = "force-dynamic";

import Dashboard from "@/components/Dashboard";
import { getDashboardData } from "@/lib/dashboard";

export default async function Home() {

  const dashboard = await getDashboardData();

  return (
    <Dashboard
        data={dashboard}
    />
  );
}