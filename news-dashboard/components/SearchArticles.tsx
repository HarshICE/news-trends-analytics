"use client";

import { useState } from "react";

type Article = {
  title: string;
  summary: string;
  link: string;
  source: string;
  image_url?: string;
  published_at?: string;
};

export default function SearchArticles({
  articles,
}: {
  articles: Article[];
}) {
  const [query, setQuery] = useState("");

  const filtered = articles.filter((article) =>
    (
        article.title +
        " " +
        (article.summary || "")
    )
        .toLowerCase()
        .includes(query.toLowerCase())
    );

  return (
    <div className="border rounded-lg p-4 shadow mb-8">
      <h2 className="text-xl font-bold mb-4">
        Search Articles
      </h2>

      <input
        type="text"
        placeholder="Search articles..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="
            w-full
            px-4
            py-3
            rounded-lg
            border
            border-gray-700
            bg-gray-900
            text-white
            placeholder:text-gray-400
            focus:outline-none
            focus:ring-2
            focus:ring-blue-500
        "
        />

      {query && (
        <>
        <p className="text-sm text-gray-400 mb-3">
            {filtered.length} results found
        </p>
        
        <div className="space-y-3">
          {filtered.slice(0, 10).map((article) => (
            <a
                key={article.link}
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="
                    flex
                    gap-4
                    p-3
                    rounded-lg
                    border
                    border-gray-800
                    hover:border-blue-500
                    hover:bg-gray-900
                    transition
                "
                >
                {article.image_url && (
                    <img
                    src={article.image_url}
                    alt={article.title}
                    className="
                        w-12
                        h-12
                        object-cover
                        rounded
                        flex-shrink-0
                    "
                    />
                )}
                <div>
                    <h3 className="font-semibold">
                        {article.title}
                    </h3>

                    <p className="text-sm text-gray-500">
                        {article.source}{" "}•{" "}{new Date(article.published_at || "").toLocaleString()}
                    </p>

        
              </div>
            </a>
          ))}

          {filtered.length === 0 && (
            <p>No articles found.</p>
          )}
        </div>
    </>
      )}
    </div>
  );
}