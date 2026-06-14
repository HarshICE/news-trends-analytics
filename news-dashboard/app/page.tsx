import { supabase } from "@/lib/supabase";
import StatsCard from "@/components/StatsCard";
import LatestArticles from "@/components/LatestArticles";
import TopKeywords from "@/components/TopKeywords";
import TopPeople from "@/components/TopPeople";
import TopOrganizations from "@/components/TopOrganizations";
import TopSources from "@/components/TopSources";
import SearchArticles from "@/components/SearchArticles";
type KeywordRow = {
  keyword: string;
};

type SourceRow = {
  source: string;
};

type CountItem = {
  keyword?: string;
  source?: string;
  count: number;
};
export default async function Home() {
  
  const [
      articleResult,
      trendResult,
      googleTrendResult,
      latestArticles,
      topKeywords,
      peopleRows,
      organizationRows,
      sourceRows
    ] = await Promise.all([
    supabase
      .from("articles")
      .select("*", { count: "exact", head: true }),

    supabase
      .from("trends")
      .select("*", { count: "exact", head: true }),

    supabase
      .from("google_trends")
      .select("*", { count: "exact", head: true }),

    supabase
      .from("articles")
      .select("*")
      .order("published_at", { ascending: false })
      .limit(500),

    supabase
      .from("top_keywords")
      .select("*")
      .limit(10),

    supabase
    .from("trends")
    .select("keyword")
    .eq("entity_type", "PERSON"),

  supabase
    .from("trends")
    .select("keyword")
    .eq("entity_type", "ORG"),

  supabase
    .from("articles")
    .select("source") 
  ]);

  const peopleCounts: CountItem[] = Object.values(
      (peopleRows.data ?? []).reduce<Record<string, CountItem>>(
        (acc, row: KeywordRow) => {
          const keyword = row.keyword;

          if (!acc[keyword]) {
            acc[keyword] = {
              keyword,
              count: 0,
            };
          }

          acc[keyword].count++;

          return acc;
        },
        {}
      )
    )
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

  const organizationCounts: CountItem[] = Object.values(
      (organizationRows.data ?? []).reduce<Record<string, CountItem>>(
        (acc, row: KeywordRow) => {
          const keyword = row.keyword;

          if (!acc[keyword]) {
            acc[keyword] = {
              keyword,
              count: 0,
            };
          }

          acc[keyword].count++;

          return acc;
        },
        {}
      )
    )
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

  const sourceCounts: CountItem[] = Object.values(
      (sourceRows.data ?? []).reduce<Record<string, CountItem>>(
        (acc, row: SourceRow) => {
          const source = row.source;

          if (!acc[source]) {
            acc[source] = {
              source,
              count: 0,
            };
          }

          acc[source].count++;

          return acc;
        },
        {}
      )
    );

  return (
    <main className="p-8 max-w-7xl mx-auto">
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

      {/* Search Articles */}
      <SearchArticles
        articles={latestArticles.data || []}
      />

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