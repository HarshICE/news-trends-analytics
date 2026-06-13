import os
import feedparser

from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_KEY = os.environ["SUPABASE_KEY"]

supabase = create_client(
    SUPABASE_URL,
    SUPABASE_KEY
)

GOOGLE_TRENDS_RSS = (
    "https://trends.google.com/trending/rss?geo=IN"
)

def save_trend(trend):

    try:

        supabase.table(
            "google_trends"
        ).insert(
            trend
        ).execute()

        print(
            f"Saved: {trend['trend_name']}"
        )

    except Exception as e:

        print(e)

def process_trends():

    feed = feedparser.parse(
        GOOGLE_TRENDS_RSS
    )

    print(
        f"Found {len(feed.entries)} trends"
    )

    
    for entry in feed.entries:

        trend = {
            "trend_name": entry.get("title"),

            "traffic": entry.get("ht_approx_traffic"),

            "image_url": entry.get("ht_picture"),

            "news_title": entry.get("ht_news_item_title"),

            "news_source": entry.get("ht_news_item_source"),

            "news_url": entry.get("ht_news_item_url"),

            "published_at": entry.get("published")
        }

        save_trend(trend)

def main():

    process_trends()

if __name__ == "__main__":
    main()