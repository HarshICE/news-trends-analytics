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
        result = supabase.table("articles").insert(article).execute()
        print(f"Saved: {article['title']}")
        print(result)

    except Exception as e:
        print(f"ERROR inserting article: {article['title']}")
        print(str(e))


def process_feed(feed_name, feed_url):
    feed = feedparser.parse(feed_url)

    print(f"Feed: {feed_name}")
    print(f"Entries found: {len(feed.entries)}")

    if feed.bozo:
        print("Feed parse error:")
        print(feed.bozo_exception)

    for entry in feed.entries:
        print(f"Processing: {entry.get('title', 'NO TITLE')}")

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