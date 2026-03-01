export type Timeframe = "daily" | "weekly" | "monthly";
export type Persona = "c_level" | "product_manager" | "developer" | "copilot_user" | "cursor_user" | "windsurf_user";
export type SearchDepth = "basic" | "advanced";

export interface NewsItem {
  title: string;
  summary: string;
  url: string;
  source: string;
  publishedAt: string | null;
  relevanceScore?: number;
}

/** RSS kaynağı tarama sonucu (rapor için) */
export interface RssSourceResult {
  name: string;
  url: string;
  status: "success" | "error";
  itemsCount: number;
  error?: string;
}

/** Tavily tarama sonucu (rapor için) */
export interface TavilyScanResult {
  status: "success" | "error";
  resultsCount: number;
  /** Benzersiz domain sayısı */
  uniqueDomainsCount: number;
  /** Örnek domainler (en fazla 10) */
  sampleDomains: string[];
  error?: string;
}

export interface FetchNewsResult {
  persona: Persona;
  timeframe: Timeframe;
  fetchedAt: string;
  tavilyResults: NewsItem[];
  rssResults: NewsItem[];
  totalCount: number;
  warnings: string[];
  /** Rapor için: RSS kaynak bazlı sonuçlar */
  rssSourceResults?: RssSourceResult[];
  /** Rapor için: Tavily tarama özeti */
  tavilyScanResult?: TavilyScanResult;
}

export interface RssSource {
  name: string;
  url: string;
  persona: Persona[];
  language: "en" | "tr";
}
