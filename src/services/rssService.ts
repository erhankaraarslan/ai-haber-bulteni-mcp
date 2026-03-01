import Parser from "rss-parser";
import type { NewsItem, Persona, RssSourceResult, Timeframe } from "../types/index.js";
import { getSourcesForPersona } from "../config/rssSources.js";

const RSS_TIMEOUT_MS = 8_000;
const MAX_ITEMS_PER_FEED = 7;
const RSS_CONCURRENCY = 6;

const parser = new Parser({
  timeout: RSS_TIMEOUT_MS,
  customFields: {
    item: ["media:content", "media:thumbnail"],
  },
});

function getTimeframeCutoff(timeframe: Timeframe): Date {
  const now = Date.now();
  const ms: Record<Timeframe, number> = {
    daily: 24 * 60 * 60 * 1000,
    weekly: 7 * 24 * 60 * 60 * 1000,
    monthly: 30 * 24 * 60 * 60 * 1000,
  };
  return new Date(now - ms[timeframe]);
}

async function runWithConcurrency<T>(
  tasks: (() => Promise<T>)[],
  limit: number
): Promise<PromiseSettledResult<T>[]> {
  const results: PromiseSettledResult<T>[] = new Array(tasks.length);
  let index = 0;

  async function worker() {
    while (index < tasks.length) {
      const i = index++;
      try {
        results[i] = { status: "fulfilled", value: await tasks[i]() };
      } catch (reason) {
        results[i] = { status: "rejected", reason };
      }
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, tasks.length) }, () => worker()));
  return results;
}

export async function fetchFromRss(
  persona: Persona,
  timeframe: Timeframe,
  maxItemsPerFeed = MAX_ITEMS_PER_FEED
): Promise<{
  items: NewsItem[];
  warnings: string[];
  sourceResults: RssSourceResult[];
}> {
  const sources = getSourcesForPersona(persona);
  const warnings: string[] = [];
  const sourceResults: RssSourceResult[] = [];
  const cutoff = getTimeframeCutoff(timeframe);

  const tasks = sources.map((source) => () =>
    parser
      .parseURL(source.url)
      .then((feed) =>
        (feed.items ?? [])
          .filter((item) => {
            const dateStr = item.pubDate ?? item.isoDate;
            if (!dateStr) return true;
            return new Date(dateStr) >= cutoff;
          })
          .slice(0, maxItemsPerFeed)
          .map(
            (item): NewsItem => ({
              title: item.title ?? "Başlık Yok",
              summary:
                item.contentSnippet ??
                item.summary ??
                item.content?.slice(0, 300) ??
                "",
              url: item.link ?? item.guid ?? "",
              source: source.name,
              publishedAt: item.pubDate ?? item.isoDate ?? null,
            })
          )
      )
  );

  const results = await runWithConcurrency(tasks, RSS_CONCURRENCY);

  const allItems: NewsItem[] = [];

  results.forEach((result, index) => {
    const source = sources[index];
    if (result.status === "fulfilled") {
      const items = result.value;
      allItems.push(...items);
      sourceResults.push({
        name: source.name,
        url: source.url,
        status: "success",
        itemsCount: items.length,
      });
    } else {
      const errMsg = (result.reason as Error)?.message ?? "Bilinmeyen hata";
      const msg = `"${source.name}" kaynağı yüklenemedi: ${errMsg}`;
      warnings.push(msg);
      sourceResults.push({
        name: source.name,
        url: source.url,
        status: "error",
        itemsCount: 0,
        error: errMsg,
      });
      process.stderr.write(`[RSS UYARI] ${msg}\n`);
    }
  });

  return { items: allItems, warnings, sourceResults };
}
