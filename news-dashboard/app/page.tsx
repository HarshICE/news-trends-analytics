export const dynamic = "force-dynamic";

import { supabase } from "@/lib/supabase";
import RealtimeListener from "@/components/RealtimeListener";
import { getDashboardData } from "@/lib/dashboard";
import StatsCard from "@/components/StatsCard";
import LatestArticles from "@/components/LatestArticles";
import TopKeywords from "@/components/TopKeywords";
import TopPeople from "@/components/TopPeople";
import TopOrganizations from "@/components/TopOrganizations";
import TopSources from "@/components/TopSources";
import SearchArticles from "@/components/SearchArticles";
import TopGoogleTrends from "@/components/TopGoogleTrends";
import {
  Article,
  KeywordRow,
  SourceRow,
  CountItem,
  GoogleTrend
} from "@/types/dashboard";
export default async function Home() {

  const {
  articleResult,
  trendResult,
  googleTrendResult,
  latestArticles,
  topKeywords,
  peopleCounts,
  organizationCounts,
  sourceCounts,
  uniqueGoogleTrends,
} = await getDashboardData();

  return (
    <main className="p-8 max-w-7xl mx-auto">
      <RealtimeListener />

      <h1 className="text-4xl font-bold mb-8">
        News Analytics Dashboard
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <StatsCard
          title="Total Articles"
          value={articleResult.count}
        />

        <StatsCard
          title="Total Trends"
          value={trendResult.count}
        />

        <StatsCard
          title="Google Trends"
          value={googleTrendResult.count}
        />
      </div>
      {/* Top Keywords */}
      <TopKeywords
        data={topKeywords.data || []}
      />

      <div className="grid md:grid-cols-2 gap-6 mt-8">
        {/* Top People */}
        <TopPeople
          data={peopleCounts}
        />
        {/* Top Organizations */}
        <TopOrganizations
          data={organizationCounts}
        />

      </div>
      {/* Top Source */}
      <div className="mt-8">

        <TopSources
          data={sourceCounts}
        />

      </div>

      {/* Top Google Trends */}
      <div className="mt-8">
        <TopGoogleTrends
          data={uniqueGoogleTrends || []}
        />
      </div>

      {/* Search Articles */}
      <div className="mt-8">
        <SearchArticles
          articles={latestArticles.data || []}
        />
      </div>

      {/* Latest News */}
      <h2 className="text-2xl font-bold mb-4">
        Latest News
      </h2>

      <LatestArticles
        articles={latestArticles.data?.slice(0, 10) || []}
      />
    </main>
  );
}