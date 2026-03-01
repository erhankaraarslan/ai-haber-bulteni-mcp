import axios from "axios";
import type { NewsItem, Timeframe } from "../types/index.js";
import { TIMEFRAME_MAP } from "../config/personas.js";

const TAVILY_API_URL = "https://api.tavily.com/search";
const REQUEST_TIMEOUT_MS = 20_000;
const MAX_RETRIES = 1;
const RETRY_DELAY_MS = 1_500;

export type SearchDepth = "basic" | "advanced";

const TRUSTED_AI_DOMAINS = [
  "techcrunch.com",
  "venturebeat.com",
  "technologyreview.com",
  "theverge.com",
  "wired.com",
  "arstechnica.com",
  "openai.com",
  "anthropic.com",
  "deepmind.google",
  "blog.google",
  "blogs.nvidia.com",
  "blogs.microsoft.com",
  "devblogs.microsoft.com",
  "aws.amazon.com",
  "huggingface.co",
  "arxiv.org",
  "marktechpost.com",
  "aibusiness.com",
  "github.blog",
  "code.visualstudio.com",
  "cursor.com",
  "forum.cursor.com",
  "windsurf.com",
  "codeium.com",
  "towardsdatascience.com",
  "latent.space",
  "reuters.com",
  "bloomberg.com",
  "a16z.com",
  "deeplearning.ai",
  "blog.langchain.dev",
  "simonwillison.net",
  "bensbites.com",
];

async function withRetry<T>(
  fn: () => Promise<T>,
  retries = MAX_RETRIES,
  delayMs = RETRY_DELAY_MS
): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    if (retries <= 0) throw err;
    const isRetryable =
      axios.isAxiosError(err) &&
      (!err.response || err.response.status >= 500 || err.code === "ECONNABORTED");
    if (!isRetryable) throw err;
    process.stderr.write(`[TAVILY] İstek başarısız, ${delayMs}ms sonra tekrar denenecek...\n`);
    await new Promise((r) => setTimeout(r, delayMs));
    return withRetry(fn, retries - 1, delayMs * 2);
  }
}

export async function fetchFromTavily(
  query: string,
  timeframe: Timeframe,
  maxResults = 10,
  searchDepth: SearchDepth = "basic"
): Promise<NewsItem[]> {
  const apiKey = process.env.TAVILY_API_KEY;

  if (!apiKey || apiKey.trim() === "") {
    throw new Error(
      "TAVILY_API_KEY ortam değişkeni tanımlanmamış veya boş.\n" +
      "Lütfen MCP konfigürasyonunuzdaki 'env' bölümüne TAVILY_API_KEY ekleyin.\n" +
      "Ücretsiz API anahtarı için: https://app.tavily.com"
    );
  }

  const timeRange = TIMEFRAME_MAP[timeframe];

  const doRequest = () =>
    axios.post(
      TAVILY_API_URL,
      {
        query,
        search_depth: searchDepth,
        topic: "news",
        time_range: timeRange,
        max_results: maxResults,
        include_answer: false,
        include_raw_content: false,
        include_domains: TRUSTED_AI_DOMAINS,
        ...(searchDepth === "advanced" ? { chunks_per_source: 3 } : {}),
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        timeout: REQUEST_TIMEOUT_MS,
      }
    );

  try {
    const response = await withRetry(doRequest);

    return (response.data.results ?? []).map(
      (item: {
        title: string;
        content: string;
        url: string;
        published_date?: string;
        score?: number;
      }): NewsItem => ({
        title: item.title ?? "Başlık Yok",
        summary: item.content ?? "",
        url: item.url ?? "",
        source: extractDomain(item.url),
        publishedAt: item.published_date ?? null,
        relevanceScore: item.score,
      })
    );
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error("Tavily API anahtarı geçersiz. Lütfen anahtarınızı kontrol edin.");
      }
      if (error.response?.status === 429) {
        throw new Error(
          "Tavily API istek limiti aşıldı. Lütfen birkaç dakika bekleyip tekrar deneyin."
        );
      }
      if (error.response?.status === 432) {
        throw new Error(
          "Tavily API plan limitiniz aşıldı. Lütfen planınızı yükseltin veya support@tavily.com ile iletişime geçin."
        );
      }
      if (error.response?.status === 433) {
        throw new Error(
          "Tavily API kullandıkça öde (PayGo) limitiniz aşıldı. Tavily kontrol panelinden limitinizi artırabilirsiniz."
        );
      }
      if (error.code === "ECONNABORTED") {
        throw new Error(
          `Tavily API isteği zaman aşımına uğradı (${REQUEST_TIMEOUT_MS / 1000}s).`
        );
      }
    }
    throw new Error(`Tavily API hatası: ${(error as Error).message}`);
  }
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return "bilinmeyen-kaynak";
  }
}
