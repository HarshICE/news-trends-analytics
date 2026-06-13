from pytrends.request import TrendReq
from supabase import create_client
from dotenv import load_dotenv
import os

load_dotenv()

supabase = create_client(
    os.environ["SUPABASE_URL"],
    os.environ["SUPABASE_KEY"]
)

pytrends = TrendReq(
    hl='en-US',
    tz=330
)

def fetch_trending_searches():

    trends = pytrends.trending_searches(
        pn='india'
    )

    return trends

def save_trend(keyword, rank):

    try:

        row = {
            "keyword": keyword,
            "rank": rank
        }

        supabase.table(
            "google_trends"
        ).insert(row).execute()

        print(
            f"Saved: {keyword}"
        )

    except Exception as e:

        print(
            f"Error saving {keyword}"
        )

        print(e)

def process_trends():

    trends = fetch_trending_searches()

    for index, row in trends.iterrows():

        keyword = row[0]

        save_trend(
            keyword,
            index + 1
        )


def main():

    process_trends()

if __name__ == "__main__":
    main()