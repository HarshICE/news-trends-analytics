import { supabase } from "@/lib/supabase";
import TopKeywords from "@/components/TopKeywords";

export default async function Home() {
  const [
    articleResult,
    trendResult,
    googleTrendResult,
    latestArticles,
    topKeywords
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
      .limit(10),

    supabase
      .from("top_keywords")
      .select("*")
      .limit(10),
  ]);

  return (
    <main className="p-8 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">
        News Analytics Dashboard
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <div className="border rounded-lg p-6 shadow">
          <p className="text-gray-500">Total Articles</p>
          <h2 className="text-3xl font-bold">
            {articleResult.count}
          </h2>
        </div>

        <div className="border rounded-lg p-6 shadow">
          <p className="text-gray-500">Total Trends</p>
          <h2 className="text-3xl font-bold">
            {trendResult.count}
          </h2>
        </div>

        <div className="border rounded-lg p-6 shadow">
          <p className="text-gray-500">Google Trends</p>
          <h2 className="text-3xl font-bold">
            {googleTrendResult.count}
          </h2>
        </div>
      </div>

      <TopKeywords
        data={topKeywords.data || []}
      />

      {/* Latest News */}
      <h2 className="text-2xl font-bold mb-4">
        Latest News
      </h2>

      <div className="grid gap-6">
        {latestArticles.data?.map((article) => (
          <div
            key={article.link}
            className="border rounded-lg p-4 shadow"
          >
            {article.image_url && (
              <img
                src={article.image_url}
                alt={article.title}
                className="w-full h-56 object-cover rounded mb-4"
              />
            )}

            <h3 className="text-lg font-semibold mb-2">
              {article.title}
            </h3>

            <p className="text-gray-500 text-sm">
              Source: {article.source}
            </p>

            <a
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Read Article
            </a>
          </div>
        ))}
      </div>
    </main>
  );
}