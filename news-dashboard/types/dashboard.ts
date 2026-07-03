export interface Article {
  title: string;
  link: string;
  summary?: string;
  source: string;
  image_url?: string;
  published_at: string;
}

export interface KeywordRow {
  keyword: string;
}

export interface SourceRow {
  source: string;
}

export interface CountItem {
  keyword?: string;
  source?: string;
  count: number;
}

export interface GoogleTrend {
  trend_name: string;
  traffic: string;
}

export interface Stats {
  articles: number;
  trends: number;
  googleTrends: number;
}