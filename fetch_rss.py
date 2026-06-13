import os
import feedparser
from datetime import datetime
from supabase import create_client
from dotenv import load_dotenv
import spacy

load_dotenv()

SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_KEY = os.environ["SUPABASE_KEY"]

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
nlp = spacy.load("en_core_web_sm")

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

def extract_keywords(text):

    doc = nlp(text)

    unique = {}

    for ent in doc.ents:

        if ent.label_ in [
            "PERSON",
            "ORG",
            "GPE",
            "EVENT",
            "PRODUCT"
        ]:

            unique[ent.text.strip()] = ent.label_

    return [
        {
            "keyword": k,
            "entity_type": v
        }
        for k, v in unique.items()
    ]

def article_exists(link):
    try:
        result = (
            supabase.table("articles")
            .select("id")
            .eq("link", link)
            .limit(1)
            .execute()
        )

        return len(result.data) > 0

    except Exception as e:
        print("Existence check error:", e)
        return False

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

def save_trends(keywords, source, article_link):

    for item in keywords:

        trend = {
            "keyword": item["keyword"],
            "entity_type": item["entity_type"],
            "source": source,
            "article_link": article_link
        }

        supabase.table("trends").insert(trend).execute()

def save_article(article):
    try:
        result = supabase.table("articles").upsert(article,on_conflict="link").execute()
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

        title = entry.get("title", "")
        content = entry.get("summary", "")
        link = entry.get("link", "")

        if article_exists(link):
            print(f"Skipping existing article: {title}")
            continue
        
        combined_text = (title + " " + content)

        keywords = extract_keywords(combined_text)

        image_url = extract_image(entry)

        article = {
            "title": title,
            "link": link,
            "summary": entry.get("summary", ""),
            "source": feed_name,
            "image_url": image_url,
            "published_at": entry.get("published", None)
        }

        save_article(article)

        save_trends(
            keywords,
            feed_name,
            link
        )


def main():
    for feed in RSS_FEEDS:
        print(f"Fetching {feed['name']}...")
        process_feed(feed["name"], feed["url"])


if __name__ == "__main__":
    main()