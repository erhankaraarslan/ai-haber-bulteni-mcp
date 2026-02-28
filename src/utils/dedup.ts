import type { NewsItem } from "../types/index.js";

const TITLE_SIMILARITY_THRESHOLD = 0.8;

function normalizeUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    urlObj.search = "";
    urlObj.hash = "";
    return urlObj
      .toString()
      .replace(/\/+$/, "")
      .replace(/^https?:\/\/(www\.)?/, "")
      .toLowerCase();
  } catch {
    return url.toLowerCase();
  }
}

function titleSimilarity(a: string, b: string): number {
  const wordsA = new Set(a.toLowerCase().split(/\s+/).filter(Boolean));
  const wordsB = new Set(b.toLowerCase().split(/\s+/).filter(Boolean));
  if (wordsA.size === 0 || wordsB.size === 0) return 0;
  const intersection = [...wordsA].filter((w) => wordsB.has(w)).length;
  return intersection / Math.max(wordsA.size, wordsB.size);
}

export function deduplicateNews(items: NewsItem[]): NewsItem[] {
  const seenUrls = new Set<string>();
  const kept: NewsItem[] = [];

  for (const item of items) {
    const norm = normalizeUrl(item.url);

    if (seenUrls.has(norm)) continue;

    const isTitleDuplicate = kept.some(
      (existing) => titleSimilarity(existing.title, item.title) >= TITLE_SIMILARITY_THRESHOLD
    );
    if (isTitleDuplicate) continue;

    seenUrls.add(norm);
    kept.push(item);
  }

  return kept;
}
