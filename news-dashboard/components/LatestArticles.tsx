type Article = {
  title: string;
  link: string;
  image_url: string | null;
  source: string;
};

export default function LatestArticles({
  articles,
}: {
  articles: Article[];
}) {
  return (
    <div className="grid gap-6">
      {articles.map((article) => (
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
  );
}