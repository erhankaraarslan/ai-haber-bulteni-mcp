import type { NewsItem } from "../types/index.js";

const TITLE_WORD_THRESHOLD = 0.7;
const TITLE_BIGRAM_THRESHOLD = 0.55;

const STOP_WORDS = new Set([
  "the", "a", "an", "is", "are", "was", "were", "in", "on", "at", "to",
  "for", "of", "with", "and", "or", "not", "it", "its", "this", "that",
  "from", "by", "as", "be", "has", "have", "had", "will", "can", "do",
  "new", "how", "what", "why", "ai", "artificial", "intelligence",
]);

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

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return "";
  }
}

function getSignificantWords(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\sşçğüöıİ]/gi, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2 && !STOP_WORDS.has(w))
  );
}

function getBigrams(text: string): Set<string> {
  const clean = text.toLowerCase().replace(/[^a-z0-9\sşçğüöıİ]/gi, "");
  const bigrams = new Set<string>();
  for (let i = 0; i < clean.length - 1; i++) {
    bigrams.add(clean.slice(i, i + 2));
  }
  return bigrams;
}

function wordOverlap(a: string, b: string): number {
  const wordsA = getSignificantWords(a);
  const wordsB = getSignificantWords(b);
  if (wordsA.size === 0 || wordsB.size === 0) return 0;
  const intersection = [...wordsA].filter((w) => wordsB.has(w)).length;
  return intersection / Math.min(wordsA.size, wordsB.size);
}

function bigramSimilarity(a: string, b: string): number {
  const biA = getBigrams(a);
  const biB = getBigrams(b);
  if (biA.size === 0 || biB.size === 0) return 0;
  const intersection = [...biA].filter((bg) => biB.has(bg)).length;
  return (2 * intersection) / (biA.size + biB.size);
}

function isSimilarTitle(a: string, b: string): boolean {
  if (wordOverlap(a, b) >= TITLE_WORD_THRESHOLD) return true;
  if (bigramSimilarity(a, b) >= TITLE_BIGRAM_THRESHOLD) return true;
  return false;
}

export function deduplicateNews(items: NewsItem[]): NewsItem[] {
  const seenUrls = new Set<string>();
  const kept: NewsItem[] = [];

  const domainCounts = new Map<string, number>();

  for (const item of items) {
    const norm = normalizeUrl(item.url);
    if (seenUrls.has(norm)) continue;

    const isTitleDuplicate = kept.some((existing) =>
      isSimilarTitle(existing.title, item.title)
    );
    if (isTitleDuplicate) continue;

    seenUrls.add(norm);

    const domain = extractDomain(item.url);
    domainCounts.set(domain, (domainCounts.get(domain) ?? 0) + 1);

    kept.push(item);
  }

  return kept;
}
