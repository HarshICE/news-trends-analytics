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
        result = supabase.table("articles").upsert(article,on_conflict="link").execute()
        print(f"Saved: {article['title']}")
        print(result)

    except Exception as e:
        print(f"ERROR inserting article: {article['title']}")
        print(str(e))

def extract_image(entry):
    # media_thumbnail
    if "media_thumbnail" in entry:
        return entry.media_thumbnail[0]["url"]

    # media_content
    if "media_content" in entry:
        return entry.media_content[0]["url"]

    # enclosure
    if "links" in entry:
        for link in entry.links:
            if link.get("type", "").startswith("image"):
                return link.get("href")

    return None

def detect_category(title):
    title = title.lower()

    sports = [
        "cricket", "football", "ipl",
        "fifa", "tennis", "nba",
        "match", "sports"
    ]

    entertainment = [
        "movie", "film", "actor",
        "actress", "bollywood",
        "hollywood", "music"
    ]

    technology = [
        "ai", "artificial intelligence",
        "tech", "software",
        "google", "microsoft",
        "apple"
    ]

    business = [
        "stock", "market",
        "economy", "business",
        "startup", "finance"
    ]

    if any(word in title for word in sports):
        return "Sports"

    if any(word in title for word in entertainment):
        return "Entertainment"

    if any(word in title for word in technology):
        return "Technology"

    if any(word in title for word in business):
        return "Business"

    return "General"

def process_feed(feed_name, feed_url):
    feed = feedparser.parse(feed_url)
    
    print(f"Feed: {feed_name}")
    print(f"Entries found: {len(feed.entries)}")

    if feed.bozo:
        print("Feed parse error:")
        print(feed.bozo_exception)

    for entry in feed.entries:
        print(f"Processing: {entry.get('title', 'NO TITLE')}")

        category = detect_category(entry.get("title", ""))
        image_url = extract_image(entry)
        
        article = {
            "title": entry.get("title", ""),
            "link": entry.get("link", ""),
            "summary": entry.get("summary", ""),
            "source": feed_name,
            "category": category,
            "image_url": image_url,
            "published_at": entry.get("published", None)
        }

        save_article(article)


def main():
    for feed in RSS_FEEDS:
        print(f"Fetching {feed['name']}...")
        process_feed(feed["name"], feed["url"])


if __name__ == "__main__":
    main()