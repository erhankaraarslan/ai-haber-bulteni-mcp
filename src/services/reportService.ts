import { writeFile, readFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import type { FetchNewsResult, TavilyScanResult } from "../types/index.js";
import { PERSONA_CONFIG, TIMEFRAME_LABELS } from "../config/personas.js";
import { deduplicateNews, interleaveArrays, sortBySourceDiversity } from "../utils/dedup.js";

const REPORT_FILENAME = "newsletter-tarama-raporu.md";
const MAX_HISTORY_ENTRIES = 50;
const SECTION_SEPARATOR = "\n\n---\n\n";

function buildReportSection(result: FetchNewsResult): string {
  const personaLabel = PERSONA_CONFIG[result.persona]?.label ?? result.persona;
  const timeframeLabel = TIMEFRAME_LABELS[result.timeframe] ?? result.timeframe;
  const interleaved = interleaveArrays(result.tavilyResults, result.rssResults);
  const deduped = deduplicateNews(interleaved);
  const dedupedSorted = sortBySourceDiversity(deduped, 50);

  const lines: string[] = [];

  lines.push(`## 📋 Tarama Özeti`);
  lines.push("");
  lines.push(`| Özellik | Değer |`);
  lines.push(`|---------|-------|`);
  lines.push(`| **Persona** | ${personaLabel} |`);
  lines.push(`| **Zaman Dilimi** | ${timeframeLabel} |`);
  lines.push(`| **Tarama Zamanı** | ${result.fetchedAt} |`);
  lines.push(`| **Tavily Haber** | ${result.tavilyResults.length} |`);
  lines.push(`| **RSS Haber** | ${result.rssResults.length} |`);
  lines.push(`| **Toplam (dedup öncesi)** | ${result.totalCount} |`);
  lines.push(`| **Benzersiz (dedup sonrası)** | ${dedupedSorted.length} |`);
  lines.push("");

  if (result.tavilyScanResult) {
    const t = result.tavilyScanResult;
    lines.push(`### 🔍 Tavily API Özeti`);
    lines.push("");
    lines.push(`| Metrik | Değer |`);
    lines.push(`|--------|-------|`);
    lines.push(`| **Durum** | ${t.status === "success" ? "✅ Başarılı" : "❌ Hata"} |`);
    lines.push(`| **Sonuç Sayısı** | ${t.resultsCount} |`);
    lines.push(`| **Benzersiz Domain** | ${t.uniqueDomainsCount} |`);
    if (t.error) {
      lines.push(`| **Hata** | ${t.error} |`);
    }
    if (t.sampleDomains.length > 0) {
      lines.push("");
      lines.push(`**Örnek Kaynaklar:** ${t.sampleDomains.slice(0, 10).join(", ")}`);
    }
    lines.push("");
  }

  if (result.rssSourceResults && result.rssSourceResults.length > 0) {
    const rss = result.rssSourceResults;
    const successCount = rss.filter((s) => s.status === "success").length;
    const errorCount = rss.filter((s) => s.status === "error").length;

    lines.push(`### 📡 RSS Kaynak Durumu (${rss.length} kaynak)`);
    lines.push("");
    lines.push(`| Durum | Sayı |`);
    lines.push(`|-------|------|`);
    lines.push(`| ✅ Başarılı | ${successCount} |`);
    lines.push(`| ❌ Hata | ${errorCount} |`);
    lines.push("");
    lines.push(`| # | Kaynak | URL | Durum | Haber | Hata |`);
    lines.push(`|---|--------|-----|-------|-------|------|`);

    rss.forEach((s, i) => {
      const status = s.status === "success" ? "✅" : "❌";
      const shortUrl = s.url.length > 50 ? s.url.slice(0, 47) + "..." : s.url;
      const err = s.error ? s.error.slice(0, 40) + (s.error.length > 40 ? "…" : "") : "—";
      lines.push(`| ${i + 1} | ${s.name} | \`${shortUrl}\` | ${status} | ${s.itemsCount} | ${err} |`);
    });
    lines.push("");
  }

  if (result.warnings.length > 0) {
    lines.push(`### ⚠️ Uyarılar`);
    lines.push("");
    result.warnings.forEach((w) => lines.push(`- ${w}`));
    lines.push("");
  }

  lines.push(`### 📰 Çekilen Haberler (ilk 15, kaynak çeşitliliği sıralı)`);
  lines.push("");
  const items = dedupedSorted.slice(0, 15);
  if (items.length > 0) {
    lines.push(`| # | Başlık | Kaynak | Tarih |`);
    lines.push(`|---|--------|--------|-------|`);
    items.forEach((item, i) => {
      const title = item.title.slice(0, 60) + (item.title.length > 60 ? "…" : "");
      lines.push(`| ${i + 1} | ${title} | ${item.source} | ${item.publishedAt?.slice(0, 10) ?? "—"} |`);
    });
  } else {
    lines.push("*Hiç haber çekilemedi.*");
  }
  lines.push("");

  return lines.join("\n");
}

function extractTavilyDomains(items: { source: string }[]): { domains: string[]; count: number } {
  const domainSet = new Set<string>();
  for (const item of items) {
    const domain = item.source?.trim();
    if (domain) domainSet.add(domain);
  }
  return { domains: [...domainSet], count: domainSet.size };
}

/**
 * Mevcut rapora yeni tarama bölümünü ekler veya oluşturur.
 * Son MAX_HISTORY_ENTRIES sayıda tarama tutulur.
 */
export async function appendReportSection(
  result: FetchNewsResult,
  outputDir: string
): Promise<string> {
  // Tavily özeti oluştur
  const tavilyItems = result.tavilyResults;
  const { domains, count: uniqueDomainsCount } = extractTavilyDomains(tavilyItems);
  const tavilyScanResult: TavilyScanResult = {
    status: result.warnings.some((w) => w.includes("Tavily")) ? "error" : "success",
    resultsCount: tavilyItems.length,
    uniqueDomainsCount,
    sampleDomains: domains.slice(0, 10),
    error: result.warnings.find((w) => w.includes("Tavily"))?.replace(/^Tavily API hatası: /, ""),
  };

  const enrichedResult: FetchNewsResult = {
    ...result,
    tavilyScanResult,
  };

  const newSection = buildReportSection(enrichedResult);

  const reportPath = join(outputDir, REPORT_FILENAME);

  let existingContent = "";
  try {
    existingContent = await readFile(reportPath, "utf-8");
  } catch {
    existingContent = "";
  }

  const header = `# 📊 AI Haber Bülteni Tarama Raporu

> Son güncelleme: ${new Date().toLocaleString("tr-TR", { dateStyle: "medium", timeStyle: "medium" })}

Bu rapor \`fetch_ai_news\` ve \`generate_newsletter\` araçları her çalıştığında otomatik güncellenir.

`;

  const dashIndex = existingContent.indexOf("\n\n---\n\n");
  const prevHeader = dashIndex >= 0 ? existingContent.slice(0, dashIndex) : "";
  const prevSectionsRaw = dashIndex >= 0 ? existingContent.slice(dashIndex + SECTION_SEPARATOR.length) : "";
  const prevSections = prevSectionsRaw
    .split(SECTION_SEPARATOR)
    .filter((s) => s.trim().length > 0);

  const allSections = [newSection, ...prevSections].slice(0, MAX_HISTORY_ENTRIES);
  const fullContent = header + allSections.join(SECTION_SEPARATOR) + "\n";

  await mkdir(outputDir, { recursive: true });
  await writeFile(reportPath, fullContent, "utf-8");

  return reportPath;
}
