import { supabase } from "@/lib/supabase";

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

  return {
    articleResult,
    trendResult,
    googleTrendResult,
    latestArticles,
    topKeywords,
    peopleRows,
    organizationRows,
    sourceRows,
    googleTrends,
  };
}