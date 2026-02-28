export type Timeframe = "daily" | "weekly" | "monthly";
export type Persona = "c_level" | "product_manager" | "developer";
export type SearchDepth = "basic" | "advanced";

export interface NewsItem {
  title: string;
  summary: string;
  url: string;
  source: string;
  publishedAt: string | null;
  relevanceScore?: number;
}

export interface FetchNewsResult {
  persona: Persona;
  timeframe: Timeframe;
  fetchedAt: string;
  tavilyResults: NewsItem[];
  rssResults: NewsItem[];
  totalCount: number;
  warnings: string[];
}

export interface RssSource {
  name: string;
  url: string;
  persona: Persona[];
  language: "en" | "tr";
}
