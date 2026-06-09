import os
import feedparser
from datetime import datetime
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_KEY = os.environ["SUPABASE_KEY"]

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

RSS_FEEDS = [
    {
        "name": "TheHindu",
        "url": "https://www.thehindu.com/feeder/default.rss"
    },
    {
        "name": "HindustanTimes",
        "url": "https://www.hindustantimes.com/feeds/rss/india-news/rssfeed.xml"
    },
    {
        "name": "IndianExpress",
        "url": "https://indianexpress.com/feed/"
    },
    {
        "name": "NDTV",
        "url": "https://feeds.feedburner.com/ndtvnews-latest"
    }
]


def save_article(article):
    try:
        supabase.table("articles").insert(article).execute()
        print(f"Saved: {article['title']}")
    except Exception:
        # Usually duplicate link
        pass


def process_feed(feed_name, feed_url):
    feed = feedparser.parse(feed_url)

    for entry in feed.entries:
        article = {
            "title": entry.get("title", ""),
            "link": entry.get("link", ""),
            "summary": entry.get("summary", ""),
            "source": feed_name,
            "published_at": datetime.utcnow().isoformat()
        }

        save_article(article)


def main():
    for feed in RSS_FEEDS:
        print(f"Fetching {feed['name']}...")
        process_feed(feed["name"], feed["url"])


if __name__ == "__main__":
    main()