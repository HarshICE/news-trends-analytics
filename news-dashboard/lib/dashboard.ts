import { supabase } from "@/lib/supabase";
import {
  KeywordRow,
  SourceRow,
  CountItem,
} from "@/types/dashboard";

function buildPeopleCounts(rows: KeywordRow[]): CountItem[] {
  return Object.values(
    rows.reduce<Record<string, CountItem>>((acc, row) => {
      if (!acc[row.keyword]) {
        acc[row.keyword] = {
          keyword: row.keyword,
          count: 0,
        };
      }

      acc[row.keyword].count++;

      return acc;
    }, {})
  )
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}

function buildOrganizationCounts(rows: KeywordRow[]): CountItem[] {
  return Object.values(
    rows.reduce<Record<string, CountItem>>((acc, row) => {
      if (!acc[row.keyword]) {
        acc[row.keyword] = {
          keyword: row.keyword,
          count: 0,
        };
      }

      acc[row.keyword].count++;

      return acc;
    }, {})
  )
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}

function buildSourceCounts(rows: SourceRow[]): CountItem[] {
  return Object.values(
    rows.reduce<Record<string, CountItem>>((acc, row) => {
      if (!acc[row.source]) {
        acc[row.source] = {
          source: row.source,
          count: 0,
        };
      }

      acc[row.source].count++;

      return acc;
    }, {})
  ).sort((a, b) => b.count - a.count);
}

function buildGoogleTrends(
  rows: {
    trend_name: string;
    traffic: string;
  }[]
) {
  return Array.from(
    new Map(
      rows.map((item) => [
        item.trend_name,
        item,
      ])
    ).values()
  ).slice(0, 10);
}

export async function getDashboardData() {
  const [
    articleResult,
    trendResult,
    googleTrendResult,
    latestArticles,
    topKeywords,
    peopleRows,
    organizationRows,
    sourceRows,
    googleTrends,
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
      .select("source"),

    supabase
      .from("google_trends")
      .select("trend_name, traffic")
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

    const peopleCounts = buildPeopleCounts(
        peopleRows.data ?? []
    );

    const organizationCounts =
        buildOrganizationCounts(
            organizationRows.data ?? []
    );

    const sourceCounts =
        buildSourceCounts(
            sourceRows.data ?? []
    );

    const uniqueGoogleTrends =
        buildGoogleTrends(
            googleTrends.data ?? []
    );

    return {
    articleResult,
    trendResult,
    googleTrendResult,
    latestArticles,
    topKeywords,
    peopleCounts,
    organizationCounts,
    sourceCounts,
    uniqueGoogleTrends,
    };
}